from langchain_core.prompts import ChatPromptTemplate

OUTLINE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "你是一个专业的小说家，擅长构思精彩的故事情节。"),
    ("user", """请根据以下信息生成一份详细的小说大纲：
    标题：{title}
    类型：{genre}
    风格：{style}
    简介：{synopsis}
    
    要求：
    1. 包含故事的核心冲突和高潮。
    2. 列出主要角色及其简要设定。
    3. 规划大概的章节数和每章的主要剧情点（至少规划前10章）。
    
    输出格式请保持结构化。""")
])

CHAPTER_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "你是一个高产且文笔优美的小说家。你的写作风格是：{style}。"),
    ("user", """请撰写小说《{title}》的第 {chapter_order} 章：{chapter_title}。
    
    世界观设定 (World Bible):
    {world_bible}
    
    前情提要（Context）：
    {context}
    
    本章大纲：
    {chapter_outline}
    
    要求：
    1. 字数在2000字左右。
    2. 描写生动，人物对话自然。
    3. 推动剧情发展，符合大纲设定。
    4. 严格遵守世界观设定，不要出现OOC（角色性格崩坏）或逻辑矛盾。
    
    开始写作：""")
])

SUMMARY_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "你是一个专业的编辑，擅长总结故事剧情。"),
    ("user", """请将以下章节内容总结为一段简练的摘要（200字以内），保留关键情节和人物动态：
    
    {content}
    
    摘要：""")
])

CONTINUE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "你是一个专业的小说家。请根据现有内容和世界观设定，续写接下来的剧情。"),
    ("user", """请根据上下文续写小说内容（约200-500字）。
    
    小说标题：{title}
    风格：{style}
    
    世界观设定 (World Bible):
    {world_bible}
    
    前文内容 (Preceding Context):
    {preceding_text}
    
    后文内容 (Following Context):
    {following_text}
    
    要求：
    1. 保持文风一致，流畅自然。
    2. 如果有后文，请平滑过渡。
    3. 不要重复前文已有的内容。
    4. 直接输出续写的内容，不要包含任何解释性文字。
    
    续写内容：""")
])

CONSISTENCY_CHECK_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "你是一个严谨的小说逻辑检查员。你的任务是发现文本中的逻辑漏洞、设定冲突和时间线错误。"),
    ("user", """请分析以下小说章节内容，检查是否存在逻辑一致性问题。
    
    小说标题：{title}
    
    世界观设定 (World Bible):
    {world_bible}
    
    待检查章节内容：
    {content}
    
    请重点检查以下方面：
    1. **设定冲突**: 文本内容是否与世界观设定（角色性格、能力、地点特征、世界规则）相矛盾？
    2. **逻辑漏洞**: 剧情发展是否符合因果逻辑？是否有前后矛盾之处？
    3. **时间线错误**: 事件发生的时间顺序是否混乱？
    4. **常识性错误**: 是否有违背基本常识的描写（除非设定允许）？
    
    请以 JSON 格式输出检查结果，格式如下：
    {{
        "issues": [
            {{
                "type": "setting_conflict" | "logic_error" | "timeline_error" | "common_sense",
                "severity": "high" | "medium" | "low",
                "description": "详细描述问题所在",
                "suggestion": "修改建议",
                "location": "问题在文中的大概位置"
            }}
        ],
        "overall_score": 0-100
    }}
    """)
])

IMPROVE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "你是一个卓越的小说编辑，擅长润色文字，提升文笔，使表达更生动、感人、专业。"),
    ("user", """请对以下小说片段进行润色和优化。

    小说标题：{title}
    风格：{style}

    待润色片段：
    {content}

    要求：
    1. 保持原意不变，提升文字的优美度和表现力。
    2. 增强感官描写和人物心理活动。
    3. 修正冗余、累赘或生硬的词句。
    4. 保持文风与小说整体风格一致。
    5. 直接输出润色后的内容，不要包含任何解释性文字。

    润色结果：""")
])

EXPAND_PROMPT = ChatPromptTemplate.from_messages([
    ("system", "你是一个富有想象力的小说家，擅长扩充细节，使故事情节更加丰满。"),
    ("user", """请对以下小说片段进行细节扩充和丰富。

    小说标题：{title}
    风格：{style}

    待扩充片段：
    {content}

    要求：
    1. 在保持原有情节核心的基础上，增加环境描写、动作细节、神态描写或心理活动。
    2. 使场景更具画面感，让读者更有代入感。
    3. 不要引入破坏原有逻辑的新情节。
    4. 扩充后的内容应自然融合，不要显得突兀。
    5. 直接输出扩充后的内容，不要包含任何解释性文字。

    扩充结果：""")
])

