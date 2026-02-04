import os
import time
import asyncio
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from tenacity import retry, stop_after_attempt, wait_fixed
from playwright.async_api import async_playwright
from app.models.models import Account, Platform, Novel, Chapter, PublishLog, ChapterStatus
from app.core.security import security_manager

class AccountService:
    def encrypt(self, s: str) -> str:
        return security_manager.encrypt(s)

    def decrypt(self, s: str) -> str:
        return security_manager.decrypt(s)

    def save_account(self, db: Session, platform: Platform, username: str, password: str) -> Account:
        # Check if account exists
        existing_acc = db.query(Account).filter(
            Account.platform == platform.value,
            Account.username == username
        ).first()
        
        if existing_acc:
            existing_acc.enc_password = self.encrypt(password)
            db.commit()
            db.refresh(existing_acc)
            return existing_acc
            
        acc = Account(platform=platform.value, username=username, enc_password=self.encrypt(password))
        db.add(acc)
        db.commit()
        db.refresh(acc)
        return acc

    def get_account(self, db: Session, platform: Platform, username: str) -> Optional[Account]:
        return db.query(Account).filter(
            Account.platform == platform.value, 
            Account.username == username
        ).first()

    def get_password(self, account: Account) -> str:
        return self.decrypt(account.enc_password)

account_service = AccountService()

class PublisherAdapter:
    def __init__(self, platform: Platform):
        self.platform = platform
        self.login_url = ""
        self.publish_url = ""

    async def login(self, username: str, password: str, context: Any) -> bool:
        """登录逻辑，需要子类实现"""
        raise NotImplementedError

    async def publish_chapter(self, chapter: Chapter, context: Any) -> bool:
        """发布章节逻辑，需要子类实现"""
        raise NotImplementedError

    @retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
    async def publish(self, db: Session, chapter: Chapter) -> PublishLog:
        status = "success"
        message = None

        try:
            # 获取平台账号
            acc = db.query(Account).filter(Account.platform == self.platform.value).first()
            if not acc:
                raise ValueError(f"No account found for platform {self.platform.value}")

            username = acc.username
            password = account_service.decrypt(acc.enc_password)

            async with async_playwright() as p:
                # 启动浏览器
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context()
                page = await context.new_page()

                # 登录
                if not await self.login(username, password, context):
                    raise ValueError(f"Login failed for platform {self.platform.value}")

                # 发布章节
                if not await self.publish_chapter(chapter, context):
                    raise ValueError(f"Publish failed for platform {self.platform.value}")

                # 关闭浏览器
                await browser.close()

        except Exception as e:
            status = "failed"
            message = str(e)

        log = PublishLog(platform=self.platform.value, chapter_id=chapter.id, status=status, message=message)
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

class QidianAdapter(PublisherAdapter):
    def __init__(self):
        super().__init__(Platform.QIDIAN)
        self.login_url = "https://passport.qidian.com/"
        self.publish_url = "https://author.qidian.com/"

    async def login(self, username: str, password: str, context: Any) -> bool:
        """起点中文网登录逻辑"""
        page = await context.new_page()
        await page.goto(self.login_url)
        
        # 这里需要根据实际登录页面的HTML结构调整选择器
        try:
            await page.fill("input[name='username']", username)
            await page.fill("input[name='password']", password)
            await page.click("button[type='submit']")
            await page.wait_for_url("**/author.qidian.com/**", timeout=30000)
            await page.close()
            return True
        except Exception as e:
            await page.close()
            raise e

    async def publish_chapter(self, chapter: Chapter, context: Any) -> bool:
        """起点中文网发布章节逻辑"""
        page = await context.new_page()
        await page.goto(self.publish_url)
        
        # 这里需要根据实际发布页面的HTML结构调整选择器
        try:
            # 进入小说管理页面
            await page.click("text=我的作品")
            await page.click(f"text={chapter.novel.title}")
            await page.click("text=发布新章节")
            
            # 填写章节信息
            await page.fill("input[name='chapterTitle']", chapter.title)
            await page.fill("textarea[name='chapterContent']", chapter.content)
            await page.click("button[type='submit']")
            await page.wait_for_url("**/chapter/**", timeout=30000)
            await page.close()
            return True
        except Exception as e:
            await page.close()
            raise e

class JinjiangAdapter(PublisherAdapter):
    def __init__(self):
        super().__init__(Platform.JINJIANG)
        self.login_url = "https://login.jjwxc.net/"
        self.publish_url = "https://author.jjwxc.net/"

    async def login(self, username: str, password: str, context: Any) -> bool:
        """晋江文学城登录逻辑"""
        page = await context.new_page()
        await page.goto(self.login_url)
        
        # 这里需要根据实际登录页面的HTML结构调整选择器
        try:
            await page.fill("input[name='loginname']", username)
            await page.fill("input[name='password']", password)
            await page.click("button[type='submit']")
            await page.wait_for_url("**/author.jjwxc.net/**", timeout=30000)
            await page.close()
            return True
        except Exception as e:
            await page.close()
            raise e

    async def publish_chapter(self, chapter: Chapter, context: Any) -> bool:
        """晋江文学城发布章节逻辑"""
        page = await context.new_page()
        await page.goto(self.publish_url)
        
        # 这里需要根据实际发布页面的HTML结构调整选择器
        try:
            # 进入小说管理页面
            await page.click("text=我的文章")
            await page.click(f"text={chapter.novel.title}")
            await page.click("text=更新章节")
            
            # 填写章节信息
            await page.fill("input[name='chapter_title']", chapter.title)
            await page.fill("textarea[name='chapter_content']", chapter.content)
            await page.click("button[type='submit']")
            await page.wait_for_url("**/chapter/**", timeout=30000)
            await page.close()
            return True
        except Exception as e:
            await page.close()
            raise e
