from sqlalchemy.orm import Session
from app.models.models import Novel, Chapter, NovelStatus, ChapterStatus
from app.services.llm_service import llm_service
from app.services.context_manager import context_manager
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class NovelService:
    async def create_novel(self, db: Session, title: str, genre: str, style: str, synopsis: str, author_id: int = None):
        # 1. Create DB entry
        db_novel = Novel(
            title=title,
            genre=genre,
            style=style,
            synopsis=synopsis,
            author_id=author_id,
            status=NovelStatus.PLANNING
        )
        db.add(db_novel)
        db.commit()
        db.refresh(db_novel)
        
        # 2. Generate Outline (In real app, this should be a background task)
        # For MVP, we do it here but maybe just store the request to generate later?
        # Or let the controller call the generation.
        # Let's keep it simple: return the novel object, let the API trigger generation.
        return db_novel

    async def generate_novel_outline(self, db: Session, novel_id: int):
        novel = db.query(Novel).filter(Novel.id == novel_id).first()
        if not novel:
            raise ValueError("Novel not found")
            
        try:
            outline = await llm_service.generate_outline(
                title=novel.title,
                genre=novel.genre,
                style=novel.style,
                synopsis=novel.synopsis
            )
            
            novel.outline = outline
            db.commit()
            db.refresh(novel)
            
            return outline
        except Exception as e:
            logger.error(f"Error generating novel outline: {e}")
            raise Exception(f"Failed to generate novel outline: {str(e)}")

    async def create_chapter(self, db: Session, novel_id: int, title: str, order: int, outline_snippet: str):
        db_chapter = Chapter(
            novel_id=novel_id,
            title=title,
            order=order,
            status=ChapterStatus.DRAFT,
            content="" # Empty initially
        )
        db.add(db_chapter)
        db.commit()
        db.refresh(db_chapter)
        
        # Trigger generation - but handle failures gracefully
        try:
            novel = db.query(Novel).filter(Novel.id == novel_id).first()
            
            # Context retrieval
            # Query using outline snippet + title to find relevant previous parts
            query = f"{title} {outline_snippet}"
            context = await context_manager.query_context(novel_id, query)
            if not context:
                context = "暂无前情提要。"
            
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
            
            try:
                content = await llm_service.generate_chapter(
                    title=novel.title,
                    style=novel.style,
                    chapter_order=order,
                    chapter_title=title,
                    context=context,
                    chapter_outline=outline_snippet,
                    world_bible=world_bible
                )
                
                db_chapter.content = content
                db_chapter.status = ChapterStatus.REVIEWING
                
                try:
                    # Generate summary and store in Vector DB
                    summary = await llm_service.generate_summary(content)
                    db_chapter.summary = summary
                    await context_manager.add_chapter_summary(novel_id, db_chapter.id, summary)
                except Exception as e:
                    logger.error(f"Error generating or storing chapter summary: {e}")
                    # Continue even if summary generation fails
                    pass
            except Exception as e:
                logger.error(f"Error generating chapter content: {e}")
                # Continue even if chapter content generation fails
                pass
            
            db.commit()
            db.refresh(db_chapter)
        except Exception as e:
            logger.error(f"Unexpected error in create_chapter: {e}")
            # Chapter is already created in DB, so we can still return it
            pass
        
        return db_chapter

novel_service = NovelService()
