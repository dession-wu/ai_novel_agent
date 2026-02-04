from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class NovelStatus(str, enum.Enum):
    PLANNING = "planning"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    PAUSED = "paused"

class ChapterStatus(str, enum.Enum):
    DRAFT = "draft"
    REVIEWING = "reviewing"
    PUBLISHED = "published"
    APPROVED = "approved"
    REJECTED = "rejected"

class Novel(Base):
    __tablename__ = "novels"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    genre = Column(String) # e.g., Fantasy, Sci-Fi
    style = Column(String) # e.g., Dark, Humorous
    synopsis = Column(Text, nullable=True)
    outline = Column(Text, nullable=True) # Generated full outline
    status = Column(String, default=NovelStatus.PLANNING)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    chapters = relationship("Chapter", back_populates="novel", cascade="all, delete-orphan")
    characters = relationship("Character", back_populates="novel", cascade="all, delete-orphan")
    locations = relationship("Location", back_populates="novel", cascade="all, delete-orphan")
    world_settings = relationship("WorldSetting", back_populates="novel", cascade="all, delete-orphan")
    author = relationship("User", back_populates="novels")

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    novel_id = Column(Integer, ForeignKey("novels.id"))
    title = Column(String)
    content = Column(Text)
    summary = Column(Text, nullable=True) # Summary for context
    order = Column(Integer)
    status = Column(String, default=ChapterStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    novel = relationship("Novel", back_populates="chapters")
    revisions = relationship("ChapterRevision", back_populates="chapter", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="chapter", cascade="all, delete-orphan")

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    novel_id = Column(Integer, ForeignKey("novels.id"))
    name = Column(String, index=True)
    role = Column(String) # Protagonist, Antagonist, Supporting
    gender = Column(String, nullable=True)
    age = Column(String, nullable=True)
    description = Column(Text)
    traits = Column(Text) # JSON string or specific format
    avatar_url = Column(String, nullable=True)
    
    novel = relationship("Novel", back_populates="characters")

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    novel_id = Column(Integer, ForeignKey("novels.id"))
    name = Column(String, index=True)
    description = Column(Text)
    parent_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    
    novel = relationship("Novel", back_populates="locations")
    children = relationship("Location", backref=backref('parent', remote_side=[id]))

class WorldSetting(Base):
    __tablename__ = "world_settings"

    id = Column(Integer, primary_key=True, index=True)
    novel_id = Column(Integer, ForeignKey("novels.id"))
    concept = Column(String) # e.g., "Magic System", "Geography"
    category = Column(String, default="General") # Rule, Geography, History, Magic, etc.
    description = Column(Text)
    
    novel = relationship("Novel", back_populates="world_settings")

class ChapterRevision(Base):
    __tablename__ = "chapter_revisions"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chapter = relationship("Chapter", back_populates="revisions")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    author = Column(String)
    body = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chapter = relationship("Chapter", back_populates="comments")

class Platform(str, enum.Enum):
    QIDIAN = "qidian"
    JINJIANG = "jinjiang"

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String)
    username = Column(String)
    enc_password = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PublishLog(Base):
    __tablename__ = "publish_logs"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String)
    novel_id = Column(Integer, ForeignKey("novels.id"), nullable=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=True)
    status = Column(String)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# 用户模型 - 用于JWT认证
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Integer, default=1)
    is_admin = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # 关系：用户创建的小说
    novels = relationship("Novel", back_populates="author")
