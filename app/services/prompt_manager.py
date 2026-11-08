from langchain_core.prompts import PromptTemplate
from app.services.prompts import OUTLINE_PROMPT, CHAPTER_PROMPT, SUMMARY_PROMPT

class PromptManager:
    """管理和优化各种类型的Prompt模板"""
    
    def __init__(self):
        self.templates = {
            "outline": OUTLINE_PROMPT,
            "chapter": CHAPTER_PROMPT,
            "summary": SUMMARY_PROMPT
        }
    
    def get_template(self, template_type: str) -> PromptTemplate:
        """获取指定类型的Prompt模板"""
        return self.templates.get(template_type, OUTLINE_PROMPT)
    
    def update_template(self, template_type: str, template: PromptTemplate):
        """更新指定类型的Prompt模板"""
        self.templates[template_type] = template
    
    def get_best_template(self, template_type: str) -> PromptTemplate:
        """获取指定类型的最佳模板"""
        # 当前版本只支持一个模板，未来可以扩展为多个模板选择
        return self.templates.get(template_type, OUTLINE_PROMPT)
    


# 创建单例实例
prompt_manager = PromptManager()
