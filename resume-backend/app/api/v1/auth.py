from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserResponse, LoginRequest
from app.core.security import hash_password, create_access_token, verify_password
from app.core.security import get_current_user
from app.utils.activity_tracker import log_user_activity

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_pw = hash_password(user_data.password)

    new_user = User(
        full_name=user_data.name,
        email=user_data.email,
        password_hash=hashed_pw,
        career_level=user_data.career_level,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id)})

    return UserResponse(
        id=new_user.id,
        name=new_user.full_name,
        email=new_user.email,
        career_level=new_user.career_level,
        token=token
    )

@router.post("/login")
def login(request_data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request_data.email).first()

    if not user or not verify_password(request_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token({"sub": user.email})
    log_user_activity(
        db=db, 
        user_id=user.id, 
        action="resume_update", 
        meta_data={"fields": 'changed_fields'}
    )
    
    avatar_url = ''
    if user.avatar_url:
        # ✅ Dynamically build full backend URL (no hardcoding)
        # This ensures correct protocol, host, and port are used automatically.
        base_url = str(request.base_url).rstrip("/")
        avatar_url = f"{base_url}{user.avatar_url}"
        
    return {
        "status": "success",
        "token": access_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "career_level": user.career_level,
            "avatar_url": avatar_url
        },
    }

@router.get("/auth/verify")
def verify_token(request: Request, current_user: User = Depends(get_current_user)):
    avatar_url = ''
    if current_user.avatar_url:
        # ✅ Dynamically build full backend URL (no hardcoding)
        # This ensures correct protocol, host, and port are used automatically.
        base_url = str(request.base_url).rstrip("/")
        avatar_url = f"{base_url}{current_user.avatar_url}"
    """
    Verify the current JWT token validity.
    Returns user info if valid.
    """
    return {
        "status": "valid", 
        "user": {
            "id": current_user.id, 
            "full_name": current_user.full_name,
            "email": current_user.email,
            "career_level": current_user.career_level,
            "avatar_url": avatar_url
        }
    }