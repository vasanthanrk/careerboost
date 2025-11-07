from fastapi import APIRouter, Depends, HTTPException, UploadFile, Request, File
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_current_user
from app.core.security import hash_password, verify_password, get_current_user
from app.utils.activity_tracker import log_user_activity
from app.utils.change_ditect import get_changed_fields
import os

UPLOAD_DIR = "uploads/avatars"

router = APIRouter()
@router.get("/user/me")
def get_me(request: Request,current_user: User = Depends(get_current_user)):
    avatar_url = ''
    if current_user.avatar_url:
        # ✅ Dynamically build full backend URL (no hardcoding)
        # This ensures correct protocol, host, and port are used automatically.
        base_url = str(request.base_url).rstrip("/")
        avatar_url = f"{base_url}{current_user.avatar_url}"

    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "location": current_user.location,
        "career_level": current_user.career_level,
        "avatar_url": avatar_url,
        "plan": current_user.plan.value,
        "settings": current_user.settings or {},
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
    }

@router.post("/user/upload-avatar")
async def upload_avatar(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    # Ensure upload directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Generate unique filename
    filename = f"user_{current_user.id}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Save the file
    with open(filepath, "wb") as f:
        f.write(await file.read())

    # ✅ Dynamically build full backend URL (no hardcoding)
    # This ensures correct protocol, host, and port are used automatically.
    base_url = str(request.base_url).rstrip("/")   # e.g. "http://localhost:8082"
    avatar_url = f"/{UPLOAD_DIR}/{filename}"

    # Update user record
    current_user.avatar_url = avatar_url
    avatar_url = f"{base_url}{avatar_url}"

    changed_fields = get_changed_fields(current_user)
    if changed_fields:
        log_user_activity(
            db=db, 
            user_id=current_user.id, 
            action="profile_pic_updated", 
            meta_data={"fields": changed_fields}
        )

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "message": "Avatar updated successfully",
        "avatar_url": avatar_url,
    }

# -----------------------------------------
# ✅ UPDATE PROFILE (name, email, avatar, career level)
# -----------------------------------------
@router.put("/user/profile")
async def update_profile(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    if not isinstance(data, dict):
        raise HTTPException(status_code=400, detail="Invalid request body")

    full_name = data.get("full_name")
    email = data.get("email")
    career_level = data.get("career_level")
    avatar_url = data.get("avatar_url")
    location = data.get("location")
    phone = data.get("phone")

    if email and email != current_user.email:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")

    if full_name:
        current_user.full_name = full_name
    if email:
        current_user.email = email
    if career_level:
        current_user.career_level = career_level
    if avatar_url:
        current_user.avatar_url = avatar_url
    if location:
        current_user.location = location
    if phone:
        current_user.phone = phone

    changed_fields = get_changed_fields(current_user)
    if changed_fields:
        log_user_activity(
            db=db, 
            user_id=current_user.id, 
            action="profile_details_updated", 
            meta_data={"fields": changed_fields}
        )

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {"message": "Profile updated successfully", "user": {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "career_level": current_user.career_level,
        "avatar_url": current_user.avatar_url
    }}

# -----------------------------------------
# ✅ CHANGE PASSWORD
# -----------------------------------------
@router.put("/user/password")
async def change_password(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Parse JSON body safely
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    old_password = data.get("old_password")
    new_password = data.get("new_password")

    # Validate fields
    if not old_password or not new_password:
        raise HTTPException(
            status_code=400,
            detail="Both old_password and new_password are required"
        )

    # Verify existing password using your app.core.security.verify_password
    if not verify_password(old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    # Hash new password with your existing hash_password() method
    new_hashed_pw = hash_password(new_password)
    current_user.password_hash = new_hashed_pw

    changed_fields = get_changed_fields(current_user)
    if changed_fields:
        log_user_activity(
            db=db, 
            user_id=current_user.id, 
            action="profile_password_updated", 
            meta_data={"fields": changed_fields}
        )

    # Commit to DB
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "message": "Password updated successfully"
    }

# -----------------------------------------
# ✅ UPDATE NOTIFICATION SETTINGS (darkMode, emailNotifications, marketingEmails)
# -----------------------------------------
@router.put("/user/settings")
async def update_settings(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    settings = current_user.settings or {}

    # merge new keys
    for key in ["emailNotifications", "darkMode", "marketingEmails"]:
        if key in data:
            settings[key] = bool(data[key])
    
    current_user.settings = dict(settings)
    flag_modified(current_user, "settings")  # 👈 tell SQLAlchemy to update it

    changed_fields = get_changed_fields(current_user)
    if changed_fields:
        log_user_activity(
            db=db, 
            user_id=current_user.id, 
            action="profile_settings_updated", 
            meta_data={"fields": changed_fields}
        )

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Settings updated successfully",
        "settings": current_user.settings
    }
