import re
from typing import List, Tuple, Dict, Any
from app.models.models import ChapterStatus, Chapter, Comment, ChapterRevision
from sqlalchemy.orm import Session
from app.services.llm_service import llm_service

from app.services.prompts import CONSISTENCY_CHECK_PROMPT
from langchain_core.output_parsers import JsonOutputParser

class ProofreadingService:
    def __init__(self):
        self.sensitive_words = ["暴力", "血腥", "涉黄"]
        self.output_parser = JsonOutputParser()
        # 使用简单的基于规则的检查，无需Java依赖
        # 未来可以替换为language_tool_python.LanguageTool('zh-CN')

    def filter_sensitive(self, text: str) -> List[Tuple[str, int]]:
        found = []
        for w in self.sensitive_words:
            for m in re.finditer(re.escape(w), text):
                found.append((w, m.start()))
        return found

    async def grammar_check(self, text: str) -> Dict[str, Any]:
        # 增强的语法检查功能
        corrections = []
        
        # 常见中文语法问题规则
        patterns = [
            # 重复词语
            (r'的的+', '重复使用"的"', '的', 'duplicate_word'),
            (r'了了+', '重复使用"了"', '了', 'duplicate_word'),
            (r'是是+', '重复使用"是"', '是', 'duplicate_word'),
            (r'啊啊+', '重复使用"啊"', '啊', 'duplicate_word'),
            (r'哦哦+', '重复使用"哦"', '哦', 'duplicate_word'),
            (r'嗯嗯+', '重复使用"嗯"', '嗯', 'duplicate_word'),
            
            # 常见标点错误
            (r'，+', '多个逗号连续使用', '，', 'punctuation_error'),
            (r'。+', '多个句号连续使用', '。', 'punctuation_error'),
            (r'、+', '多个顿号连续使用', '、', 'punctuation_error'),
            
            # 常见语法错误
            (r'的得', '"的"和"得"使用错误', '的', 'grammar_error'),
            (r'得了了', '"得"和"了"使用错误', '得了', 'grammar_error'),
            (r'是在', '"是"和"在"使用错误', '是', 'grammar_error'),
            
            # 其他常见错误
            (r'一个一个', '重复使用"一个"', '一个', 'redundant_phrase'),
            (r'非常非常', '重复使用"非常"', '非常', 'redundant_phrase'),
            (r'很很', '重复使用"很"', '很', 'redundant_phrase'),
            (r'更加更加', '重复使用"更加"', '更加', 'redundant_phrase'),
            (r'越来越越来越', '重复使用"越来越"', '越来越', 'redundant_phrase'),
            (r'可以可以', '重复使用"可以"', '可以', 'redundant_phrase'),
            (r'应该应该', '重复使用"应该"', '应该', 'redundant_phrase'),
            (r'可能可能', '重复使用"可能"', '可能', 'redundant_phrase'),
            (r'必须必须', '重复使用"必须"', '必须', 'redundant_phrase'),
            (r'需要需要', '重复使用"需要"', '需要', 'redundant_phrase'),
        ]
        
        for pattern, message, suggestion, rule_id in patterns:
            for m in re.finditer(pattern, text):
                corrections.append({
                    "start": m.start(),
                    "end": m.end(),
                    "message": message,
                    "suggestion": suggestion,
                    "rule_id": rule_id
                })
        
        return {
            "text": text,
            "corrections": corrections,
            "error_count": len(corrections)
        }

    async def analyze_logical_consistency(self, text: str, context: str = "", world_bible: str = "", title: str = "") -> Dict[str, Any]:
        """增强的逻辑一致性分析功能"""
        # 1. 基于规则的初步逻辑检查
        rule_based_issues = self._rule_based_logical_check(text, context)
        
        # 2. 使用LLM进行深度逻辑分析
        llm_issues = await self._llm_based_logical_check(text, context, world_bible, title)
        
        # 3. 合并结果
        all_issues = rule_based_issues + llm_issues
        
        return {
            "text": text,
            "context": context,
            "issues": all_issues,
            "issue_count": len(all_issues)
        }
    
    def _rule_based_logical_check(self, text: str, context: str) -> List[Dict[str, Any]]:
        """基于规则的逻辑一致性检查"""
        issues = []
        
        # 规则1：时间矛盾检测
        time_patterns = [
            (r'昨天.*?今天', '同一天内的时间矛盾', '检查时间描述的一致性'),
            (r'上午.*?下午', '同一天内的时间矛盾', '检查时间顺序的合理性'),
            (r'年初.*?年底', '同一年内的时间矛盾', '检查时间跨度的合理性'),
        ]
        
        for pattern, message, suggestion in time_patterns:
            for m in re.finditer(pattern, text):
                issues.append({
                    "type": "time_conflict",
                    "start": m.start(),
                    "end": m.end(),
                    "message": message,
                    "suggestion": suggestion,
                    "rule_id": "time_conflict"
                })
        
        # 规则2：地点矛盾检测
        location_patterns = [
            (r'北京.*?上海', '短时间内的地点矛盾', '检查地点转换的合理性'),
            (r'家里.*?办公室', '短时间内的地点矛盾', '检查地点转换的合理性'),
            (r'室内.*?室外', '短时间内的地点矛盾', '检查地点转换的合理性'),
        ]
        
        for pattern, message, suggestion in location_patterns:
            for m in re.finditer(pattern, text):
                issues.append({
                    "type": "location_conflict",
                    "start": m.start(),
                    "end": m.end(),
                    "message": message,
                    "suggestion": suggestion,
                    "rule_id": "location_conflict"
                })
        
        # 规则3：人物状态矛盾检测
        character_patterns = [
            (r'死了.*?活着', '人物状态矛盾', '检查人物状态描述的一致性'),
            (r'生病了.*?健康', '人物状态矛盾', '检查人物状态描述的一致性'),
            (r'在睡觉.*?在工作', '人物状态矛盾', '检查人物状态描述的一致性'),
        ]
        
        for pattern, message, suggestion in character_patterns:
            for m in re.finditer(pattern, text):
                issues.append({
                    "type": "character_conflict",
                    "start": m.start(),
                    "end": m.end(),
                    "message": message,
                    "suggestion": suggestion,
                    "rule_id": "character_conflict"
                })
        
        return issues
    
    async def _llm_based_logical_check(self, text: str, context: str, world_bible: str = "", title: str = "") -> List[Dict[str, Any]]:
        """基于LLM的深度逻辑分析，包含世界观设定检查"""
        
        try:
            # 准备 Prompt 数据
            input_data = {
                "title": title or "未知标题",
                "world_bible": world_bible or "暂无详细设定",
                "content": text
            }
            
            # 使用 CONSISTENCY_CHECK_PROMPT 创建 Chain
            chain = CONSISTENCY_CHECK_PROMPT | llm_service.llm | self.output_parser
            
            # 执行分析
            result = await chain.ainvoke(input_data)
            
            # 处理返回结果
            issues = result.get("issues", [])
            
            # 标准化输出格式
            formatted_issues = []
            for issue in issues:
                formatted_issues.append({
                    "type": issue.get("type", "logic_error"),
                    "message": issue.get("description", "未描述的问题"),
                    "suggestion": issue.get("suggestion", ""),
                    "severity": issue.get("severity", "medium"),
                    "quote": issue.get("quote", "")
                })
                
            return formatted_issues
            
        except Exception as e:
            print(f"Consistency check failed: {e}")
            return []

    def add_revision(self, db: Session, chapter: Chapter, content: str) -> ChapterRevision:
        rev = ChapterRevision(chapter_id=chapter.id, content=content)
        db.add(rev)
        db.commit()
        db.refresh(rev)
        return rev

    def add_comment(self, db: Session, chapter: Chapter, author: str, body: str) -> Comment:
        c = Comment(chapter_id=chapter.id, author=author, body=body)
        db.add(c)
        db.commit()
        db.refresh(c)
        return c

    def transition_status(self, db: Session, chapter: Chapter, target: ChapterStatus):
        valid = {
            ChapterStatus.DRAFT: [ChapterStatus.REVIEWING],
            ChapterStatus.REVIEWING: [ChapterStatus.APPROVED, ChapterStatus.REJECTED],
            ChapterStatus.APPROVED: [ChapterStatus.PUBLISHED],
            ChapterStatus.REJECTED: [ChapterStatus.REVIEWING],
            ChapterStatus.PUBLISHED: []
        }
        if target in valid.get(ChapterStatus(chapter.status), []):
            chapter.status = target
            db.commit()
            db.refresh(chapter)
            return chapter
        raise ValueError("invalid_transition")

proofreading_service = ProofreadingService()
