from pydantic import BaseModel
from typing import Optional, List

# --- Character ---
class CharacterBase(BaseModel):
    name: str
    role: str
    gender: Optional[str] = None
    age: Optional[str] = None
    description: str
    traits: Optional[str] = None
    avatar_url: Optional[str] = None

class CharacterCreate(CharacterBase):
    pass

class CharacterUpdate(CharacterBase):
    pass

class Character(CharacterBase):
    id: int
    novel_id: int

    class Config:
        from_attributes = True

# --- Location ---
class LocationBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None

class LocationCreate(LocationBase):
    pass

class LocationUpdate(LocationBase):
    pass

class Location(LocationBase):
    id: int
    novel_id: int

    class Config:
        from_attributes = True

# --- WorldSetting ---
class WorldSettingBase(BaseModel):
    concept: str
    category: str = "General"
    description: str

class WorldSettingCreate(WorldSettingBase):
    pass

class WorldSettingUpdate(WorldSettingBase):
    pass

class WorldSetting(WorldSettingBase):
    id: int
    novel_id: int

    class Config:
        from_attributes = True
