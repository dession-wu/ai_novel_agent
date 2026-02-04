from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas import novel as schemas
from app.models import models
from app.services.novel_service import novel_service
from app.services.proofreading_service import proofreading_service
from app.services.llm_service import llm_service
from app.models.models import ChapterStatus, Chapter, Comment, ChapterRevision
from app.api.deps import get_current_active_user
from app.models.models import User
from fastapi.responses import StreamingResponse
import json

router = APIRouter()

@router.get("/chapters/{chapter_id}", response_model=schemas.Chapter)
def get_chapter_by_id(
    chapter_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific chapter by ID"""
    ch = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    # Verify ownership
    novel = db.query(models.Novel).get(ch.novel_id)
    if novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    return ch

@router.put("/chapters/{chapter_id}", response_model=schemas.Chapter)
def update_chapter_by_id(
    chapter_id: int, 
    chapter_update: schemas.ChapterUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a specific chapter by ID"""
    ch = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    # Verify ownership
    novel = db.query(models.Novel).get(ch.novel_id)
    if novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if chapter_update.title is not None:
        ch.title = chapter_update.title
    if chapter_update.order is not None:
        ch.order = chapter_update.order
    if chapter_update.content is not None:
        ch.content = chapter_update.content
    if chapter_update.summary is not None:
        ch.summary = chapter_update.summary
    if chapter_update.status is not None:
        ch.status = chapter_update.status
    
    db.commit()
    db.refresh(ch)
    return ch

@router.get("/", response_model=List[schemas.Novel])
def list_novels(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List all novels for the current user"""
    return db.query(models.Novel).filter(models.Novel.author_id == current_user.id).all()

@router.post("/", response_model=schemas.Novel)
async def create_novel(
    novel: schemas.NovelCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return await novel_service.create_novel(
        db=db,
        title=novel.title,
        genre=novel.genre,
        style=novel.style,
        synopsis=novel.synopsis,
        author_id=current_user.id
    )

@router.get("/{novel_id}", response_model=schemas.Novel)
def read_novel(
    novel_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_novel = db.query(models.Novel).filter(models.Novel.id == novel_id).first()
    if db_novel is None:
        raise HTTPException(status_code=404, detail="Novel not found")
    return db_novel

@router.post("/{novel_id}/generate_outline", response_model=str)
async def generate_outline(
    novel_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        outline = await novel_service.generate_novel_outline(db, novel_id)
        return outline
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{novel_id}/chapters", response_model=schemas.Chapter)
async def create_chapter(
    novel_id: int, 
    chapter: schemas.ChapterCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if novel exists
    db_novel = db.query(models.Novel).filter(models.Novel.id == novel_id).first()
    if not db_novel:
        raise HTTPException(status_code=404, detail="Novel not found")
        
    return await novel_service.create_chapter(
        db=db,
        novel_id=novel_id,
        title=chapter.title,
        order=chapter.order,
        outline_snippet=chapter.outline_snippet
    )

@router.get("/{novel_id}/chapters", response_model=List[schemas.Chapter])
def read_chapters(
    novel_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(models.Chapter).filter(models.Chapter.novel_id == novel_id).order_by(models.Chapter.order).all()

@router.get("/{novel_id}/chapters/{chapter_id}", response_model=schemas.Chapter)
def read_chapter(
    novel_id: int, 
    chapter_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific chapter"""
    ch = db.query(models.Chapter).filter(models.Chapter.id == chapter_id, models.Chapter.novel_id == novel_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Chapter not found")
    return ch

@router.post("/{novel_id}/chapters/{chapter_id}/proofread")
async def proofread_chapter(
    novel_id: int, 
    chapter_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ch = db.query(models.Chapter).filter(models.Chapter.id == chapter_id, models.Chapter.novel_id == novel_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Chapter not found")
    sensitive = proofreading_service.filter_sensitive(ch.content or "")
    grammar = await proofreading_service.grammar_check(ch.content or "")
    return {"sensitive": sensitive, "grammar": grammar}

@router.post("/{novel_id}/chapters/{chapter_id}/status/{target}")
def change_status(
    novel_id: int, 
    chapter_id: int, 
    target: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ch = db.query(models.Chapter).filter(models.Chapter.id == chapter_id, models.Chapter.novel_id == novel_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Chapter not found")
    try:
        updated = proofreading_service.transition_status(db, ch, ChapterStatus(target))
        return {"status": updated.status}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid transition")

from pydantic import BaseModel

class ContinueRequest(BaseModel):
    preceding_text: str
    following_text: str

@router.post("/{novel_id}/chapters/{chapter_id}/stream_continue")
async def stream_continue_chapter(
    novel_id: int, 
    chapter_id: int, 
    request: ContinueRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check ownership
    novel = db.query(models.Novel).get(novel_id)
    if not novel or novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id, models.Chapter.novel_id == novel_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    # Prepare World Bible
    characters = novel.characters
    locations = novel.locations
    world_settings = novel.world_settings
    
    world_bible = ""
    if characters:
        world_bible += "【角色列表】\n" + "\n".join([f"- {c.name} ({c.role}): {c.description}" for c in characters]) + "\n\n"
    if locations:
        world_bible += "【地点列表】\n" + "\n".join([f"- {l.name}: {l.description}" for l in locations]) + "\n\n"
    if world_settings:
        world_bible += "【世界设定】\n" + "\n".join([f"- {s.concept} ({s.category}): {s.description}" for s in world_settings])

    async def event_generator():
        try:
            async for chunk in llm_service.stream_continue_chapter(
                title=novel.title,
                style=novel.style,
                preceding_text=request.preceding_text,
                following_text=request.following_text,
                world_bible=world_bible
            ):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

class ImproveExpandRequest(BaseModel):
    content: str

@router.post("/{novel_id}/chapters/{chapter_id}/stream_improve")
async def stream_improve_chapter(
    novel_id: int, 
    chapter_id: int, 
    request: ImproveExpandRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    novel = db.query(models.Novel).get(novel_id)
    if not novel or novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    async def event_generator():
        try:
            async for chunk in llm_service.stream_improve_text(
                title=novel.title,
                style=novel.style,
                content=request.content
            ):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/{novel_id}/chapters/{chapter_id}/stream_expand")
async def stream_expand_chapter(
    novel_id: int, 
    chapter_id: int, 
    request: ImproveExpandRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    novel = db.query(models.Novel).get(novel_id)
    if not novel or novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    async def event_generator():
        try:
            async for chunk in llm_service.stream_expand_text(
                title=novel.title,
                style=novel.style,
                content=request.content
            ):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/{novel_id}/chapters/{chapter_id}/stream_generate")
async def stream_generate_chapter(
    novel_id: int, 
    chapter_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    novel = db.query(models.Novel).get(novel_id)
    if not novel or novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id, models.Chapter.novel_id == novel_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    # Get previous chapter context
    prev_chapter = db.query(models.Chapter).filter(
        models.Chapter.novel_id == novel_id, 
        models.Chapter.order < chapter.order
    ).order_by(models.Chapter.order.desc()).first()
    
    context = prev_chapter.content[-1000:] if prev_chapter and prev_chapter.content else "第一章"
    
    # Prepare World Bible
    characters = novel.characters
    locations = novel.locations
    world_settings = novel.world_settings
    world_bible = ""
    if characters: world_bible += "【角色】\n" + "\n".join([f"- {c.name}" for c in characters]) + "\n"
    if locations: world_bible += "【地点】\n" + "\n".join([f"- {l.name}" for l in locations]) + "\n"

    async def event_generator():
        try:
            async for chunk in llm_service.stream_generate_chapter(
                title=novel.title,
                style=novel.style,
                chapter_order=chapter.order,
                chapter_title=chapter.title,
                context=context,
                chapter_outline=chapter.outline_snippet or "",
                world_bible=world_bible
            ):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/{novel_id}/chapters/{chapter_id}/consistency_check")
async def check_chapter_consistency(
    novel_id: int, 
    chapter_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check ownership
    novel = db.query(models.Novel).get(novel_id)
    if not novel or novel.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id, models.Chapter.novel_id == novel_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    if not chapter.content:
        return {"issues": [], "issue_count": 0, "message": "章节内容为空"}

    # Prepare World Bible
    characters = novel.characters
    locations = novel.locations
    world_settings = novel.world_settings
    
    world_bible = ""
    if characters:
        world_bible += "【角色列表】\n" + "\n".join([f"- {c.name} ({c.role}): {c.description}" for c in characters]) + "\n\n"
    if locations:
        world_bible += "【地点列表】\n" + "\n".join([f"- {l.name}: {l.description}" for l in locations]) + "\n\n"
    if world_settings:
        world_bible += "【世界设定】\n" + "\n".join([f"- {s.concept} ({s.category}): {s.description}" for s in world_settings])

    # Perform Analysis
    result = await proofreading_service.analyze_logical_consistency(
        text=chapter.content,
        context="", # 可以扩展为获取前文摘要
        world_bible=world_bible,
        title=novel.title
    )
    
    return result

@router.post("/{novel_id}/chapters/{chapter_id}/comments")
def add_comment(
    novel_id: int, 
    chapter_id: int, 
    author: str, 
    body: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    ch = db.query(models.Chapter).filter(models.Chapter.id == chapter_id, models.Chapter.novel_id == novel_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Chapter not found")
    c = proofreading_service.add_comment(db, ch, author, body)
    return {"id": c.id}

@router.put("/{novel_id}/chapters/{chapter_id}", response_model=schemas.Chapter)
def update_chapter(
    novel_id: int, 
    chapter_id: int, 
    chapter_update: schemas.ChapterUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a chapter"""
    ch = db.query(models.Chapter).filter(models.Chapter.id == chapter_id, models.Chapter.novel_id == novel_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    # Update chapter fields if provided
    if chapter_update.title is not None:
        ch.title = chapter_update.title
    if chapter_update.order is not None:
        ch.order = chapter_update.order
    if chapter_update.content is not None:
        ch.content = chapter_update.content
    if chapter_update.summary is not None:
        ch.summary = chapter_update.summary
    if chapter_update.status is not None:
        ch.status = chapter_update.status
    
    db.commit()
    db.refresh(ch)
    return ch
