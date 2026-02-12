# 🤖 AI Novel Agent - 智能小说写作助手

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 一个基于AI大模型的智能小说写作助手系统，为创作者提供全方位的创作支持。

## ✨ 功能特性

### 📝 核心写作功能
- **AI续写**: 根据上下文智能续写故事情节
- **AI对话**: 与AI助手讨论情节、角色设定
- **智能校对**: 语法检查、逻辑一致性检查、风格建议
- **章节管理**: 灵活的章节创建、编辑、排序功能

### 🌍 世界观构建
- **角色管理**: 创建和管理角色档案、性格特征
- **地点设定**: 构建故事发生的世界地图和场景
- **时间线**: 管理故事中的事件顺序和时间关系
- **规则设定**: 定义世界的物理规则、魔法体系等

### 🤖 AI能力
- **多模型支持**: OpenAI GPT-4、Claude、DeepSeek等
- **上下文理解**: 基于小说上下文的智能生成
- **风格适配**: 根据小说类型和风格调整AI输出
- **提示词模板**: 预设多种写作场景的提示词

### 📊 数据管理
- **作品管理**: 多小说管理、状态跟踪
- **版本控制**: 章节历史版本保存
- **导出功能**: 支持多种格式导出（Markdown、TXT等）
- **数据统计**: 创作数据统计和可视化

## 🛠️ 技术栈

### 后端技术栈
- **框架**: FastAPI (Python)
- **数据库**: SQLite + SQLAlchemy ORM
- **向量数据库**: ChromaDB (语义搜索)
- **认证**: JWT (JSON Web Tokens)
- **AI集成**: OpenAI API、Claude API、DeepSeek API

### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI组件**: 自定义组件 + shadcn/ui
- **状态管理**: React Hooks + Context
- **路由**: React Router v6
- **HTTP客户端**: Axios

## 🚀 快速开始

### 环境要求
- Python 3.12+
- Node.js 18+
- Git

### 安装步骤

#### 1. 克隆仓库
```bash
git clone https://github.com/yourusername/ai-novel-agent.git
cd ai-novel-agent
```

#### 2. 配置后端
```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加你的API密钥
```

#### 3. 配置前端
```bash
cd frontend

# 安装依赖
npm install

# 返回根目录
cd ..
```

#### 4. 启动服务

**方式一：手动启动**
```bash
# 终端1：启动后端
cd app
python init_db.py  # 初始化数据库
python ../main.py   # 启动服务

# 终端2：启动前端
cd frontend
npm run dev
```

**方式二：使用启动脚本（Windows）**
```powershell
# PowerShell
.\start_all.ps1

# 或 CMD
start_all.bat
```

#### 5. 访问应用
- 前端界面: http://localhost:5173
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 📖 使用指南

### 创建新小说
1. 登录系统
2. 点击"创建新作品"
3. 填写小说标题、类型、风格等信息
4. 开始创作！

### AI辅助写作
1. 在编辑器中输入你的故事开头
2. 点击"AI续写"按钮
3. AI会根据上下文生成后续内容
4. 可以选择接受、修改或重新生成

### 世界观构建
1. 进入"世界观"页面
2. 添加角色、地点、事件等信息
3. AI会在创作时参考这些设定
4. 保持故事的一致性和连贯性

## 📁 项目结构

```
ai-novel-agent/
├── app/                          # Python后端
│   ├── api/                      # API路由
│   │   ├── api_v1/              # API版本1
│   │   │   ├── endpoints/       # 具体端点
│   │   │   │   ├── auth.py      # 认证
│   │   │   │   ├── novels.py    # 小说管理
│   │   │   │   └── world.py     # 世界观
│   │   │   └── api.py           # 路由聚合
│   │   └── deps.py              # 依赖注入
│   ├── core/                     # 核心配置
│   ├── models/                   # 数据模型
│   ├── schemas/                  # Pydantic模式
│   ├── services/                 # 业务服务
│   └── init_db.py               # 数据库初始化
├── frontend/                     # React前端
│   ├── src/
│   │   ├── api/                 # API客户端
│   │   ├── components/          # 组件
│   │   ├── pages/               # 页面
│   │   └── services/            # 前端服务
│   ├── package.json
│   └── vite.config.js
├── docs/                         # 文档
│   ├── ARCHITECTURE.md          # 架构文档
│   └── API.md                   # API文档
├── tests/                        # 测试文件
├── requirements.txt              # Python依赖
├── package.json                  # Node依赖
├── Dockerfile                    # Docker配置
├── docker-compose.yml            # Docker Compose
└── README.md                     # 项目说明
```

## 🔧 配置说明

### 环境变量
创建 `.env` 文件并配置以下变量：

```env
# 数据库
DATABASE_URL=sqlite:///./sql_app.db

# AI API密钥（至少配置一个）
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key
DEEPSEEK_API_KEY=your_deepseek_key

# 安全配置
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 其他配置
DEBUG=True
LOG_LEVEL=INFO
```

## 🧪 测试

### 运行后端测试
```bash
pytest tests/
```

### 运行前端测试
```bash
cd frontend
npm test
```

## 🐳 Docker部署

### 使用Docker Compose
```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 手动构建
```bash
# 构建后端镜像
docker build -t ai-novel-agent-backend .

# 运行容器
docker run -p 8000:8000 ai-novel-agent-backend
```

## 📚 文档

- [架构文档](docs/ARCHITECTURE.md) - 系统架构和技术细节
- [API文档](docs/API.md) - RESTful API接口说明
- [部署指南](docs/DEPLOYMENT.md) - 生产环境部署指南
- [开发指南](docs/DEVELOPMENT.md) - 开发规范和最佳实践

## 🤝 贡献指南

我们欢迎所有形式的贡献！请阅读[CONTRIBUTING.md](CONTRIBUTING.md)了解如何参与项目。

### 贡献步骤
1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- [FastAPI](https://fastapi.tiangolo.com/) - 高性能Web框架
- [React](https://react.dev/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [OpenAI](https://openai.com/) - AI模型提供商
- [ChromaDB](https://www.trychroma.com/) - 向量数据库

## 📞 联系方式

- 项目主页: https://github.com/dession-wu/ai_novel_agent
- 问题反馈: https://github.com/dession-wu/ai_novel_agent/issues
- Github Page：https://dession-wu.github.io/ai-novel-agent
- 邮箱: your.email@example.com

## 🗺️ 路线图

- [x] 基础写作功能
- [x] AI续写和对话
- [x] 世界观构建
- [x] 多AI提供商支持
- [ ] 协作写作
- [ ] 版本控制增强
- [ ] 移动端适配
- [ ] 插件系统
- [ ] 多语言支持

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

Made with ❤️ by AI Novel Agent Team
