from typing import Dict, Any, Optional
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
        
        # 模板评估指标
        self.template_evaluations = {
            "outline": {"score": 0.85, "usage_count": 100, "feedback": []},
            "chapter": {"score": 0.82, "usage_count": 85, "feedback": []},
            "summary": {"score": 0.88, "usage_count": 120, "feedback": []}
        }
    
    def get_template(self, template_type: str) -> PromptTemplate:
        """获取指定类型的Prompt模板"""
        return self.templates.get(template_type, OUTLINE_PROMPT)
    
    def update_template(self, template_type: str, template: PromptTemplate):
        """更新指定类型的Prompt模板"""
        self.templates[template_type] = template
    
    def evaluate_template(self, template_type: str, score: float, feedback: Optional[str] = None):
        """评估模板并记录反馈"""
        eval_data = self.template_evaluations.get(template_type, {
            "score": 0.5,
            "usage_count": 0,
            "feedback": []
        })
        
        # 更新评分（简单加权平均）
        eval_data["usage_count"] += 1
        eval_data["score"] = (eval_data["score"] * (eval_data["usage_count"] - 1) + score) / eval_data["usage_count"]
        
        if feedback:
            eval_data["feedback"].append(feedback)
        
        self.template_evaluations[template_type] = eval_data
    
    def get_best_template(self, template_type: str) -> PromptTemplate:
        """获取指定类型的最佳模板"""
        # 当前版本只支持一个模板，未来可以扩展为多个模板选择
        return self.templates.get(template_type, OUTLINE_PROMPT)
    
    def generate_dynamic_prompt(self, template_type: str, context: Dict[str, Any]) -> str:
        """根据上下文动态生成Prompt"""
        template = self.get_best_template(template_type)
        
        # 根据内容类型和长度调整Prompt
        dynamic_params = {
            "detail_level": "high",
            "creativity": "medium"
        }
        
        # 调整详细程度和创造力参数
        if template_type == "chapter":
            content_length = len(context.get("chapter_outline", ""))
            if content_length > 500:
                dynamic_params["detail_level"] = "medium"
            
            # 根据小说风格调整创造力
            style = context.get("style", "").lower()
            if style in ["fantasy", "science fiction", "scifi"]:
                dynamic_params["creativity"] = "high"
            elif style in ["mystery", "thriller"]:
                dynamic_params["creativity"] = "medium"
            else:
                dynamic_params["creativity"] = "low"
        
        # 合并动态参数到上下文
        dynamic_context = {**context, **dynamic_params}
        
        return template.format_prompt(**dynamic_context).text
    
    def get_template_evaluation(self, template_type: str) -> Dict[str, Any]:
        """获取模板评估数据"""
        return self.template_evaluations.get(template_type, {})

# 创建单例实例
prompt_manager = PromptManager()
