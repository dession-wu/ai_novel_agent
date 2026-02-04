# AI Novel Agent - API文档

## 概述

本文档描述了AI Novel Agent系统的RESTful API接口。所有API都遵循RESTful设计原则，使用JSON格式进行数据交换。

**基础URL**: `http://localhost:8000/api/v1`

**认证方式**: JWT Bearer Token

## 认证

### 获取访问令牌

**POST** `/auth/login`

**请求体**:
```json
{
  "username": "user@example.com",
  "password": "your_password"
}
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 注册新用户

**POST** `/auth/register`

**请求体**:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "secure_password"
}
```

**响应**:
```json
{
  "id": 1,
  "username": "newuser",
  "email": "newuser@example.com",
  "created_at": "2024-01-20T10:00:00Z"
}
```

### 获取当前用户信息

**GET** `/auth/me`

**请求头**:
```
Authorization: Bearer <access_token>
```

**响应**:
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "created_at": "2024-01-20T10:00:00Z"
}
```

## 小说管理

### 获取小说列表

**GET** `/novels`

**请求头**:
```
Authorization: Bearer <access_token>
```

**响应**:
```json
[
  {
    "id": 1,
    "title": "星际征途",
    "genre": "科幻",
    "style": "硬核",
    "synopsis": "一个关于人类探索宇宙的故事",
    "status": "ongoing",
    "chapters": 15,
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2024-01-20T14:30:00Z"
  }
]
```

### 创建小说

**POST** `/novels`

**请求头**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**请求体**:
```json
{
  "title": "魔法学院",
  "genre": "奇幻",
  "style": "轻松",
  "synopsis": "年轻魔法师的成长之路"
}
```

**响应**:
```json
{
  "id": 2,
  "title": "魔法学院",
  "genre": "奇幻",
  "style": "轻松",
  "synopsis": "年轻魔法师的成长之路",
  "status": "draft",
  "chapters": 0,
  "created_at": "2024-01-20T15:00:00Z",
  "updated_at": "2024-01-20T15:00:00Z"
}
```

### 获取小说详情

**GET** `/novels/{novel_id}`

**响应**:
```json
{
  "id": 1,
  "title": "星际征途",
  "genre": "科幻",
  "style": "硬核",
  "synopsis": "一个关于人类探索宇宙的故事",
  "status": "ongoing",
  "chapters": 15,
  "created_at": "2024-01-15T08:00:00Z",
  "updated_at": "2024-01-20T14:30:00Z"
}
```

### 更新小说

**PUT** `/novels/{novel_id}`

**请求体**:
```json
{
  "title": "星际征途 - 修订版",
  "genre": "科幻",
  "style": "硬核",
  "synopsis": "更新后的故事简介",
  "status": "ongoing"
}
```

**响应**:
```json
{
  "id": 1,
  "title": "星际征途 - 修订版",
  "genre": "科幻",
  "style": "硬核",
  "synopsis": "更新后的故事简介",
  "status": "ongoing",
  "chapters": 15,
  "updated_at": "2024-01-20T16:00:00Z"
}
```

### 删除小说

**DELETE** `/novels/{novel_id}`

**响应**: `204 No Content`

## 章节管理

### 获取章节列表

**GET** `/novels/{novel_id}/chapters`

**响应**:
```json
[
  {
    "id": 1,
    "novel_id": 1,
    "title": "第一章：启程",
    "content": "这是第一章的内容...",
    "order": 1,
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2024-01-20T14:30:00Z"
  }
]
```

### 创建章节

**POST** `/novels/{novel_id}/chapters`

**请求体**:
```json
{
  "title": "第二章：探索",
  "content": "这是第二章的内容...",
  "order": 2
}
```

**响应**:
```json
{
  "id": 2,
  "novel_id": 1,
  "title": "第二章：探索",
  "content": "这是第二章的内容...",
  "order": 2,
  "created_at": "2024-01-20T16:00:00Z",
  "updated_at": "2024-01-20T16:00:00Z"
}
```

### 获取章节详情

**GET** `/chapters/{chapter_id}`

**响应**:
```json
{
  "id": 1,
  "novel_id": 1,
  "title": "第一章：启程",
  "content": "这是第一章的完整内容...",
  "order": 1,
  "created_at": "2024-01-15T08:00:00Z",
  "updated_at": "2024-01-20T14:30:00Z"
}
```

### 更新章节

**PUT** `/chapters/{chapter_id}`

**请求体**:
```json
{
  "title": "第一章：新的开始",
  "content": "更新后的章节内容...",
  "order": 1
}
```

### 删除章节

**DELETE** `/chapters/{chapter_id}`

**响应**: `204 No Content`

## AI功能

### AI续写

**POST** `/ai/continue`

**请求体**:
```json
{
  "novel_id": 1,
  "chapter_id": 1,
  "context": "前文内容...",
  "style": "轻松",
  "length": 500
}
```

**响应**:
```json
{
  "content": "AI生成的续写内容...",
  "tokens_used": 150,
  "model": "gpt-4"
}
```

### AI校对

**POST** `/ai/proofread`

**请求体**:
```json
{
  "content": "需要校对的文本内容...",
  "check_types": ["grammar", "logic", "style"]
}
```

**响应**:
```json
{
  "suggestions": [
    {
      "type": "grammar",
      "position": {"start": 10, "end": 20},
      "original": "错误的文本",
      "suggestion": "正确的文本",
      "explanation": "语法错误说明"
    }
  ],
  "overall_score": 85
}
```

### AI对话

**POST** `/ai/chat`

**请求体**:
```json
{
  "novel_id": 1,
  "message": "帮我想一个情节转折",
  "context": "当前故事背景..."
}
```

**响应**:
```json
{
  "response": "AI的建议回复...",
  "suggestions": [
    "建议1",
    "建议2",
    "建议3"
  ]
}
```

## 世界观管理

### 获取世界观设定

**GET** `/world/{novel_id}`

**响应**:
```json
{
  "novel_id": 1,
  "setting": "未来宇宙",
  "rules": ["物理规则", "魔法规则"],
  "history": "世界历史背景...",
  "characters": [
    {
      "id": 1,
      "name": "主角",
      "description": "主角描述...",
      "traits": ["勇敢", "聪明"]
    }
  ],
  "locations": [
    {
      "id": 1,
      "name": "地球",
      "description": "地球描述..."
    }
  ]
}
```

### 更新世界观设定

**PUT** `/world/{novel_id}`

**请求体**:
```json
{
  "setting": "更新后的设定",
  "rules": ["更新后的规则"],
  "history": "更新后的历史..."
}
```

## 错误处理

### 错误响应格式

```json
{
  "detail": "错误描述信息",
  "status_code": 400,
  "error_type": "validation_error"
}
```

### 常见错误码

| 状态码 | 说明 | 场景 |
|--------|------|------|
| 400 | 请求参数错误 | 缺少必填字段、格式错误 |
| 401 | 未授权 | 缺少Token、Token过期 |
| 403 | 禁止访问 | 无权限访问资源 |
| 404 | 资源不存在 | 小说/章节不存在 |
| 422 | 验证错误 | 数据验证失败 |
| 500 | 服务器错误 | 内部服务器错误 |

## 数据模型

### Novel (小说)

```json
{
  "id": "integer",
  "title": "string (required)",
  "genre": "string",
  "style": "string",
  "synopsis": "string",
  "status": "string (draft|ongoing|completed|paused)",
  "chapters": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Chapter (章节)

```json
{
  "id": "integer",
  "novel_id": "integer",
  "title": "string (required)",
  "content": "string",
  "order": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### User (用户)

```json
{
  "id": "integer",
  "username": "string (required)",
  "email": "string (required)",
  "created_at": "datetime",
  "is_active": "boolean"
}
```

## 使用示例

### 完整工作流程

1. **用户登录**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password"
```

2. **创建小说**
```bash
curl -X POST "http://localhost:8000/api/v1/novels" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的小说",
    "genre": "科幻",
    "style": "轻松"
  }'
```

3. **创建章节**
```bash
curl -X POST "http://localhost:8000/api/v1/novels/1/chapters" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "第一章",
    "content": "这是第一章内容...",
    "order": 1
  }'
```

4. **AI续写**
```bash
curl -X POST "http://localhost:8000/api/v1/ai/continue" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "novel_id": 1,
    "chapter_id": 1,
    "context": "前文内容...",
    "length": 500
  }'
```

## 注意事项

1. **认证**: 除登录和注册接口外，所有接口都需要Bearer Token认证
2. **限流**: API有速率限制，默认每分钟100次请求
3. **数据格式**: 所有请求和响应都使用JSON格式
4. **时区**: 所有时间戳使用UTC时区
5. **编码**: 所有文本使用UTF-8编码

## Swagger文档

启动后端服务后，可以访问以下地址查看交互式API文档：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
