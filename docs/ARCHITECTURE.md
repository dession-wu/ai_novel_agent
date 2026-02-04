# AI Novel Agent - 系统架构文档

## 项目概述

AI Novel Agent 是一个智能小说写作助手系统，采用前后端分离架构，结合AI大模型能力，为小说创作者提供全方位的创作支持。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        前端层 (Frontend)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  React App  │  │  Tailwind   │  │  Lucide Icons       │  │
│  │  TypeScript │  │  CSS        │  │  UI Components      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        后端层 (Backend)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 FastAPI Application                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │  Auth    │  │  Novels  │  │  World Building  │   │  │
│  │  │  Router  │  │  Router  │  │  Router          │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL/SQLite
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据层 (Data Layer)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   SQLite    │  │  ChromaDB   │  │  File Storage       │  │
│  │   (SQLAlchemy)│  │  (Vector)   │  │  (Novel Content)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI服务层 (AI Services)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   OpenAI    │  │   Claude    │  │   DeepSeek          │  │
│  │   GPT-4     │  │   API       │  │   API               │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 技术栈

### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI组件**: 自定义组件 + shadcn/ui
- **状态管理**: React Hooks (useState, useContext)
- **路由**: React Router v6
- **HTTP客户端**: Axios
- **图标**: Lucide React

### 后端技术栈
- **框架**: FastAPI (Python)
- **数据库**: SQLite + SQLAlchemy
- **向量数据库**: ChromaDB
- **认证**: JWT (JSON Web Tokens)
- **API文档**: 自动生成Swagger/OpenAPI
- **AI集成**: OpenAI, Claude, DeepSeek APIs

## 核心模块说明

### 1. 认证模块 (Authentication)
**文件位置**: `app/api/endpoints/auth.py`, `app/services/auth_service.py`

**功能**:
- 用户注册/登录
- JWT令牌生成与验证
- 密码加密存储
- 用户会话管理

**关键类**:
- `AuthService`: 处理认证逻辑
- `Token`: JWT令牌模型
- `User`: 用户数据模型

### 2. 小说管理模块 (Novel Management)
**文件位置**: `app/api/endpoints/novels.py`, `app/services/novel_service.py`

**功能**:
- 小说CRUD操作
- 章节管理
- 版本控制
- 导出功能

**关键类**:
- `NovelService`: 小说业务逻辑
- `Novel`: 小说数据模型
- `Chapter`: 章节数据模型

### 3. 世界观构建模块 (World Building)
**文件位置**: `app/api/endpoints/world.py`, `app/services/context_manager.py`

**功能**:
- 世界观设定管理
- 角色管理
- 地点管理
- 事件时间线

**关键类**:
- `ContextManager`: 上下文管理
- `WorldBible`: 世界观数据模型

### 4. AI服务模块 (AI Services)
**文件位置**: `app/services/llm_service.py`, `app/services/prompt_manager.py`

**功能**:
- 多AI提供商支持
- 提示词模板管理
- 上下文窗口管理
- 响应解析与处理

**关键类**:
- `LLMService`: LLM服务封装
- `PromptManager`: 提示词管理
- `AIServiceFactory`: AI服务工厂

### 5. 校对模块 (Proofreading)
**文件位置**: `app/services/proofreading_service.py`

**功能**:
- 语法检查
- 逻辑一致性检查
- 风格建议
- 重复内容检测

### 6. 发布模块 (Publishing)
**文件位置**: `app/services/publishing_adapters.py`

**功能**:
- 多平台发布适配
- 格式转换
- 元数据管理

## 数据模型

### 核心实体关系

```
User (1) ───────< (N) Novel (1) ───────< (N) Chapter
  │                  │
  │                  │
  │                  ▼
  │            WorldBible (1)
  │                  │
  │                  ├─< (N) Character
  │                  ├─< (N) Location
  │                  └─< (N) Timeline
  │
  ▼
AIConfig (1) ──> Provider (N)
```

### 主要数据表

1. **users**: 用户信息
2. **novels**: 小说基本信息
3. **chapters**: 章节内容
4. **world_bibles**: 世界观设定
5. **characters**: 角色信息
6. **locations**: 地点信息
7. **ai_configs**: AI配置

## API设计

### RESTful API规范

#### 认证接口
```
POST   /api/v1/auth/register      # 用户注册
POST   /api/v1/auth/login         # 用户登录
POST   /api/v1/auth/refresh       # 刷新令牌
GET    /api/v1/auth/me            # 获取当前用户
```

#### 小说接口
```
GET    /api/v1/novels             # 获取小说列表
POST   /api/v1/novels             # 创建小说
GET    /api/v1/novels/{id}        # 获取小说详情
PUT    /api/v1/novels/{id}        # 更新小说
DELETE /api/v1/novels/{id}        # 删除小说
GET    /api/v1/novels/{id}/chapters      # 获取章节列表
POST   /api/v1/novels/{id}/chapters      # 创建章节
```

#### AI接口
```
POST   /api/v1/ai/generate        # 生成内容
POST   /api/v1/ai/continue        # 续写
POST   /api/v1/ai/proofread       # 校对
POST   /api/v1/ai/chat            # AI对话
```

## 前端架构

### 组件结构

```
src/
├── components/           # 可复用组件
│   ├── ui/              # 基础UI组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── Layout.tsx       # 布局组件
│   ├── Sidebar.tsx      # 侧边栏
│   └── ...
├── pages/               # 页面组件
│   ├── DashboardPage.tsx
│   ├── EditorPage.tsx
│   └── ...
├── api/                 # API客户端
│   └── api.ts
├── services/            # 前端服务
│   └── aiServiceFactory.ts
└── lib/                 # 工具函数
    └── utils.ts
```

### 状态管理

- **全局状态**: 使用React Context管理主题、用户状态
- **本地状态**: 使用useState管理组件内部状态
- **服务端状态**: 使用SWR/React Query模式（通过api.ts封装）

## 安全设计

### 认证安全
- JWT令牌存储在localStorage
- 令牌过期自动刷新
- 密码使用bcrypt加密
- HTTPS传输（生产环境）

### 数据安全
- SQL注入防护（SQLAlchemy ORM）
- XSS防护（React自动转义）
- CSRF防护（JWT无状态认证）

## 部署架构

### 开发环境
```
Frontend (Vite Dev Server)  <--->  Backend (FastAPI)  <--->  SQLite/ChromaDB
       :3000                          :8000
```

### 生产环境
```
Nginx (Reverse Proxy)
    ├── /  -->  Frontend (Static Files)
    └── /api  -->  Backend (FastAPI)
```

### Docker部署
- 使用Docker Compose编排
- 前端使用Nginx镜像
- 后端使用Python镜像
- 数据卷持久化

## 扩展性设计

### 水平扩展
- 无状态后端设计
- 支持多实例部署
- 数据库读写分离

### 功能扩展
- 插件化AI服务
- 模块化业务逻辑
- 可配置的工作流

## 性能优化

### 前端优化
- 代码分割（Code Splitting）
- 懒加载（Lazy Loading）
- 图片优化
- 缓存策略

### 后端优化
- 数据库索引
- 查询优化
- 缓存层（Redis）
- 异步处理

## 监控与日志

### 日志记录
- 应用日志: `app.log`
- 错误追踪: 异常捕获与记录
- 访问日志: API请求记录

### 性能监控
- API响应时间
- 数据库查询性能
- 前端加载性能

## 开发规范

### 代码规范
- Python: PEP 8
- TypeScript: ESLint + Prettier
- 提交信息: Conventional Commits

### 文档规范
- API文档: OpenAPI/Swagger
- 代码注释: Docstring
- 架构文档: Markdown

## 版本历史

- **v1.0.0** - 初始版本，基础功能实现
- **v1.1.0** - UI优化，性能提升
- **v1.2.0** - 新增世界观构建功能
- **v2.0.0** - 多AI提供商支持，架构重构
