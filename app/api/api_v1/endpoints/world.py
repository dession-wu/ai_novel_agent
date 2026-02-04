from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.models import models
from app.schemas import world as schemas

router = APIRouter()

# --- Characters ---

@router.post("/novels/{novel_id}/characters", response_model=schemas.Character)
def create_character(
    novel_id: int,
    character: schemas.CharacterCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    novel = db.query(models.Novel).filter(models.Novel.id == novel_id, models.Novel.author_id == current_user.id).first()
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")
        
    db_obj = models.Character(**character.model_dump(), novel_id=novel_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/novels/{novel_id}/characters", response_model=List[schemas.Character])
def get_characters(
    novel_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    novel = db.query(models.Novel).filter(models.Novel.id == novel_id, models.Novel.author_id == current_user.id).first()
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")
    return db.query(models.Character).filter(models.Character.novel_id == novel_id).all()

@router.put("/characters/{character_id}", response_model=schemas.Character)
def update_character(
    character_id: int,
    character: schemas.CharacterUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_obj = db.query(models.Character).get(character_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Character not found")
    
    # Check ownership via novel
    novel = db.query(models.Novel).get(db_obj.novel_id)
    if novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    for key, value in character.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/characters/{character_id}")
def delete_character(
    character_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_obj = db.query(models.Character).get(character_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Character not found")
    
    novel = db.query(models.Novel).get(db_obj.novel_id)
    if novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db.delete(db_obj)
    db.commit()
    return {"ok": True}

# --- Locations ---

@router.post("/novels/{novel_id}/locations", response_model=schemas.Location)
def create_location(
    novel_id: int,
    location: schemas.LocationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    novel = db.query(models.Novel).filter(models.Novel.id == novel_id, models.Novel.author_id == current_user.id).first()
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")
        
    db_obj = models.Location(**location.model_dump(), novel_id=novel_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/novels/{novel_id}/locations", response_model=List[schemas.Location])
def get_locations(
    novel_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    novel = db.query(models.Novel).filter(models.Novel.id == novel_id, models.Novel.author_id == current_user.id).first()
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")
    return db.query(models.Location).filter(models.Location.novel_id == novel_id).all()

@router.put("/locations/{location_id}", response_model=schemas.Location)
def update_location(
    location_id: int,
    location: schemas.LocationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_obj = db.query(models.Location).get(location_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Location not found")
        
    novel = db.query(models.Novel).get(db_obj.novel_id)
    if novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    for key, value in location.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/locations/{location_id}")
def delete_location(
    location_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_obj = db.query(models.Location).get(location_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Location not found")
        
    novel = db.query(models.Novel).get(db_obj.novel_id)
    if novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db.delete(db_obj)
    db.commit()
    return {"ok": True}

# --- World Settings ---

@router.post("/novels/{novel_id}/world-settings", response_model=schemas.WorldSetting)
def create_world_setting(
    novel_id: int,
    setting: schemas.WorldSettingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    novel = db.query(models.Novel).filter(models.Novel.id == novel_id, models.Novel.author_id == current_user.id).first()
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")
        
    db_obj = models.WorldSetting(**setting.model_dump(), novel_id=novel_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/novels/{novel_id}/world-settings", response_model=List[schemas.WorldSetting])
def get_world_settings(
    novel_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    novel = db.query(models.Novel).filter(models.Novel.id == novel_id, models.Novel.author_id == current_user.id).first()
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")
    return db.query(models.WorldSetting).filter(models.WorldSetting.novel_id == novel_id).all()

@router.put("/world-settings/{setting_id}", response_model=schemas.WorldSetting)
def update_world_setting(
    setting_id: int,
    setting: schemas.WorldSettingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_obj = db.query(models.WorldSetting).get(setting_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Setting not found")
        
    novel = db.query(models.Novel).get(db_obj.novel_id)
    if novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    for key, value in setting.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/world-settings/{setting_id}")
def delete_world_setting(
    setting_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_obj = db.query(models.WorldSetting).get(setting_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Setting not found")
        
    novel = db.query(models.Novel).get(db_obj.novel_id)
    if novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db.delete(db_obj)
    db.commit()
    return {"ok": True}
