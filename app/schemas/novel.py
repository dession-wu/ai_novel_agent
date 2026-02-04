from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.models import NovelStatus, ChapterStatus

class NovelBase(BaseModel):
    title: str
    genre: str
    style: str
    synopsis: Optional[str] = None

class NovelCreate(NovelBase):
    pass

class NovelUpdate(NovelBase):
    status: Optional[NovelStatus] = None
    outline: Optional[str] = None

class Novel(NovelBase):
    id: int
    status: NovelStatus
    outline: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ChapterBase(BaseModel):
    title: str
    order: int
    content: Optional[str] = None
    summary: Optional[str] = None

class ChapterCreate(ChapterBase):
    outline_snippet: str # Used for generation

class ChapterUpdate(BaseModel):
    title: Optional[str] = None
    order: Optional[int] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    status: Optional[ChapterStatus] = None

class Chapter(ChapterBase):
    id: int
    novel_id: int
    status: ChapterStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
