from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from app.core.config import settings
from app.services.prompts import OUTLINE_PROMPT, CHAPTER_PROMPT, SUMMARY_PROMPT, CONTINUE_PROMPT, IMPROVE_PROMPT, EXPAND_PROMPT
from app.services.prompt_manager import prompt_manager
from cachetools import TTLCache
import hashlib
import asyncio
from typing import AsyncGenerator

class LLMService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.7,
            streaming=True
        )
        self.output_parser = StrOutputParser()
        # 创建一个TTL缓存，最大1000个条目，过期时间3600秒（1小时）
        self.cache = TTLCache(maxsize=1000, ttl=3600)

    def _get_cache_key(self, func_name: str, **kwargs) -> str:
        # 生成缓存键，基于函数名和参数的哈希值
        sorted_kwargs = sorted(kwargs.items())
        key_str = f"{func_name}:{str(sorted_kwargs)}"
        return hashlib.md5(key_str.encode()).hexdigest()

    async def generate_outline(self, title: str, genre: str, style: str, synopsis: str) -> str:
        cache_key = self._get_cache_key("generate_outline", title=title, genre=genre, style=style, synopsis=synopsis)
        
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # 使用PromptManager获取最佳模板
        template = prompt_manager.get_best_template("outline")
        
        # 准备上下文
        context = {
            "title": title,
            "genre": genre,
            "style": style,
            "synopsis": synopsis
        }
        
        # 生成动态Prompt
        dynamic_prompt = prompt_manager.generate_dynamic_prompt("outline", context)
        
        # 使用动态Prompt创建chain
        chain = template | self.llm | self.output_parser
        result = await chain.ainvoke(context)
        
        self.cache[cache_key] = result
        return result

    async def generate_chapter(self, title: str, style: str, chapter_order: int, chapter_title: str, context: str, chapter_outline: str, world_bible: str = "") -> str:
        cache_key = self._get_cache_key("generate_chapter", title=title, style=style, chapter_order=chapter_order, 
                                     chapter_title=chapter_title, context=context, chapter_outline=chapter_outline, world_bible=world_bible)
        
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # 使用PromptManager获取最佳模板
        template = prompt_manager.get_best_template("chapter")
        
        # 准备上下文
        context_data = {
            "title": title,
            "style": style,
            "chapter_order": chapter_order,
            "chapter_title": chapter_title,
            "context": context,
            "chapter_outline": chapter_outline,
            "world_bible": world_bible
        }
        
        # 生成动态Prompt
        dynamic_prompt = prompt_manager.generate_dynamic_prompt("chapter", context_data)
        
        # 使用动态Prompt创建chain
        chain = template | self.llm | self.output_parser
        result = await chain.ainvoke(context_data)
        
        self.cache[cache_key] = result
        return result

    async def generate_summary(self, content: str) -> str:
        cache_key = self._get_cache_key("generate_summary", content=content)
        
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # 使用PromptManager获取最佳模板
        template = prompt_manager.get_best_template("summary")
        
        # 准备上下文
        context = {
            "content": content
        }
        
        # 生成动态Prompt
        dynamic_prompt = prompt_manager.generate_dynamic_prompt("summary", context)
        
        # 使用动态Prompt创建chain
        chain = template | self.llm | self.output_parser
        result = await chain.ainvoke(context)
        
        self.cache[cache_key] = result
        return result
    
    def evaluate_template(self, template_type: str, score: float, feedback: str = None):
        """评估模板并记录反馈"""
        prompt_manager.evaluate_template(template_type, score, feedback)
    
    def get_template_evaluation(self, template_type: str) -> dict:
        """获取模板评估数据"""
        return prompt_manager.get_template_evaluation(template_type)

    async def stream_continue_chapter(
        self, 
        title: str, 
        style: str, 
        preceding_text: str, 
        following_text: str, 
        world_bible: str = ""
    ) -> AsyncGenerator[str, None]:
        """流式生成续写内容"""
        
        # 准备上下文
        context_data = {
            "title": title,
            "style": style,
            "preceding_text": preceding_text,
            "following_text": following_text,
            "world_bible": world_bible
        }
        
        # 使用 CONTINUE_PROMPT
        chain = CONTINUE_PROMPT | self.llm | self.output_parser
        
        async for chunk in chain.astream(context_data):
            yield chunk

    async def stream_improve_text(
        self, 
        title: str, 
        style: str, 
        content: str
    ) -> AsyncGenerator[str, None]:
        """流式润色文字"""
        context_data = {
            "title": title,
            "style": style,
            "content": content
        }
        chain = IMPROVE_PROMPT | self.llm | self.output_parser
        async for chunk in chain.astream(context_data):
            yield chunk

    async def stream_expand_text(
        self, 
        title: str, 
        style: str, 
        content: str
    ) -> AsyncGenerator[str, None]:
        """流式扩充文字"""
        context_data = {
            "title": title,
            "style": style,
            "content": content
        }
        chain = EXPAND_PROMPT | self.llm | self.output_parser
        async for chunk in chain.astream(context_data):
            yield chunk

    async def stream_generate_chapter(
        self, 
        title: str, 
        style: str, 
        chapter_order: int, 
        chapter_title: str, 
        context: str, 
        chapter_outline: str, 
        world_bible: str = ""
    ) -> AsyncGenerator[str, None]:
        """流式生成章节"""
        context_data = {
            "title": title,
            "style": style,
            "chapter_order": chapter_order,
            "chapter_title": chapter_title,
            "context": context,
            "chapter_outline": chapter_outline,
            "world_bible": world_bible
        }
        chain = CHAPTER_PROMPT | self.llm | self.output_parser
        async for chunk in chain.astream(context_data):
            yield chunk

llm_service = LLMService()
