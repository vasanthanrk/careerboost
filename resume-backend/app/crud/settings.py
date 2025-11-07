from sqlalchemy.orm import Session
from app.models.settings import Setting

def get_setting_by_key(db: Session, key: str) -> Setting | None:
    return db.query(Setting).filter(Setting.key == key).first()

def create_or_update_setting(db: Session, key: str, value: dict, description: str | None = None) -> Setting:
    instance = get_setting_by_key(db, key)
    if instance:
        instance.value = value
        if description is not None:
            instance.description = description
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance
    new = Setting(key=key, value=value, description=description)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

def list_settings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Setting).offset(skip).limit(limit).all()
