# NOVA: Novel Origination & Visualization Assistant

<div align="center">
  <img src="logo.png" alt="NOVA Logo" width="200" height="200">
  
  <div class="mt-4 flex flex-wrap justify-center gap-2">
    <img src="https://img.shields.io/badge/Python-3.10+-blue.svg" alt="Python">
    <img src="https://img.shields.io/badge/FastAPI-0.100+-green.svg" alt="FastAPI">
    <img src="https://img.shields.io/badge/React-18+-61DAFB.svg" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
    <img src="https://img.shields.io/github/stars/yourusername/nova.svg?style=social" alt="Stars">
  </div>
</div>

NOVA（Novel Origination & Visualization Assistant）是一款 AI 驱动的长篇小说创作辅助系统，为作者提供续写、世界观管理、智能校对与项目管理的一体化工作台，将创作过程从"苦役"变为"享受"。

GitHub Pages 演示：<https://dession-wu.github.io/ai_novel_agent/>

## 要解决的问题

每位作者都会遇到同样的困扰：

- ✗ 面对空白页面发呆，等待灵感降临
- ✗ 陷入剧情漏洞和人物前后矛盾
- ✗ 花费数小时做枯燥的校对工作
- ✗ 难以维持世界观设定的一致性
- ✗ 为了赶截稿日期牺牲作品质量
- ✗ 逐渐迷失自己的创作初心

## 解决方案

NOVA 是你的 AI 创作伙伴，让创作过程从挣扎变成愉快的旅程。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 后端 | Python 3.10+、FastAPI、SQLAlchemy、SQLite/PostgreSQL |
| 前端 | React 18、TypeScript 5、Vite、Tailwind CSS |
| AI 服务 | OpenAI GPT-4 / Claude / DeepSeek（多模型切换） |
| 向量检索 | ChromaDB |
| 部署 | Docker、Docker Compose、Nginx（同源反代） |

## 功能特性

### 🚀 智能叙事引擎
- **AI 续写**：无缝续写故事，保持原有文风与叙事声音
- **上下文理解**：深度理解你的叙事世界
- **风格适配**：跨类型模仿你的独特写作风格

### 🌍 世界观构建
- **可视化世界圣经**：交互式管理角色、地点与规则
- **一致性守护**：自动发现并解决设定矛盾
- **时间线管理**：可视化追踪故事事件

### 🧠 智能校对
- **语法与文风**：专业级语言润色
- **逻辑检查**：识别剧情漏洞与人物不一致
- **反馈引擎**：给出建设性改进建议

### 📚 项目管理
- **多小说支持**：组织所有创作项目
- **版本控制**：追踪修改并可回退到旧稿
- **进度分析**：可视化创作历程与产出效率

### 🎨 AI 模型融合
- **多供应商接入**：OpenAI GPT-4、Claude、DeepSeek
- **模型优化**：按任务类型智能选择模型
- **自定义提示词**：针对个人需求微调 AI 行为

## 快速开始（Docker Compose，推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/dession-wu/ai-novel-agent.git
cd ai-novel-agent

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env，至少填写 SECRET_KEY（openssl rand -hex 32 生成）与 OPENAI_API_KEY

# 3. 构建并启动三服务（frontend / backend / db）
docker-compose up -d

# 4. 查看日志与停止服务
docker-compose logs -f
docker-compose down
```

启动成功后访问 `http://localhost:8081`（Nginx 同源反代 `/api` 至后端）。

### 手动构建镜像

```bash
# 构建后端镜像
docker build -t ai-novel-agent-backend .

# 运行容器
docker run -p 8000:8000 ai-novel-agent-backend
```

## 本地开发

### 环境要求
- Python 3.10+（Docker 镜像基于 3.10，注意不要使用 `datetime.UTC` 等高版本特性）
- Node.js 18+
- Git

### 后端

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# 或
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
```

后端服务运行在 <http://localhost:8000>，Swagger 文档见 <http://localhost:8000/docs>。

### 前端

```bash
cd frontend
npm install
cp .env.example .env.local   # 默认 VITE_API_BASE_URL=/api/v1（走 Vite 开发代理）
npm run dev
```

前端开发服务运行在 <http://localhost:5173>。

### 服务访问地址总览

| 服务 | 地址 | 说明 |
| --- | --- | --- |
| 前端应用 | http://localhost:5173 | 开发模式管理界面 |
| 前端（生产） | http://localhost:8081 | Nginx 容器 |
| 后端 API | http://localhost:8000 | 后端服务主地址 |
| API 文档 | http://localhost:8000/docs | Swagger UI |
| 监控指标 | http://localhost:8000/metrics | Prometheus 指标 |

完整安装步骤详见 [INSTALLATION.md](docs/INSTALLATION.md)，日常启动与阿里云 ECS 部署详见 [README_RUN.md](README_RUN.md)。

## 使用场景

### 📖 职业小说家
**场景**：你在创作奇幻三部曲，需要在 30+ 章节间保持世界观一致。
**方案**：用 NOVA 的世界圣经管理所有角色、地点与规则，一致性守护确保不出现剧情漏洞。

### 📱 网文作者
**场景**：你需要每周发布 5 章以维持读者黏性。
**方案**：写作瓶颈期借助 AI 续写，用项目管理功能安排并追踪发布流水线。

### 🎬 内容创作者
**场景**：你是 YouTube 编剧，需要为叙事频道产出引人入胜的故事。
**方案**：用 NOVA 生成故事大纲、充实人物，并保证多期视频间的叙事一致性。

## 系统架构

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│     Frontend        │     │     Backend         │     │     AI Services     │
│ React + TypeScript  │────▶│ FastAPI + SQLite    │────▶│ OpenAI/Claude/DeepSeek │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                      │
                                      ▼
                              ┌─────────────────────┐
                              │     Database        │
                              │ SQLite + ChromaDB   │
                              └─────────────────────┘
```

生产环境采用 Docker 三服务编排：Nginx 容器承载前端静态资源并将 `/api` 同源反向代理到 FastAPI 后端，后端连接独立的 PostgreSQL 容器，通过 HEALTHCHECK 串联启动依赖。

## 目录结构

```
ai_novel_agent/
├── app/                    # 后端源码
│   ├── api/api_v1/         # REST 接口（auth / novels / world）
│   ├── core/               # 配置、数据库、安全
│   ├── models/             # SQLAlchemy 数据模型
│   ├── schemas/            # Pydantic 模型
│   └── services/           # 业务服务（LLM、校对、上下文管理等）
├── frontend/               # 前端源码（React + TS + Vite）
│   ├── nginx/              # 生产 Nginx 同源反代配置
│   └── src/                # 页面、组件、API 客户端
├── docs/                   # 架构 / 安装 / API / 部署 / 开发文档
├── tests/                  # 后端测试
├── docker-compose.yml      # 三服务编排（frontend 8081:80 / backend / db）
├── Dockerfile              # 后端生产镜像（分层依赖、非 root、HEALTHCHECK）
└── main.py                 # 后端入口
```

## 测试

### 运行后端测试

```bash
pytest tests/
```

### 运行前端测试

```bash
cd frontend
npm test
```

## 部署

- **阿里云 ECS + Docker Compose**：详见 [README_RUN.md](README_RUN.md) 的"阿里云服务器 Docker Compose 部署"章节（三容器健康链，8081 端口对外）。
- **生产环境部署指南**：见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。
- `.env.example` / `frontend/.env.example` 提供全部环境变量说明，真实密钥严禁提交仓库。

## 文档

- [架构文档](docs/ARCHITECTURE.md) - 系统架构和技术细节
- [API 文档](docs/API.md) - RESTful API 接口说明
- [部署指南](docs/DEPLOYMENT.md) - 生产环境部署指南
- [开发指南](docs/DEVELOPMENT.md) - 开发规范和最佳实践
- [安装指南](docs/INSTALLATION.md) - 详细安装步骤
- [运行手册](README_RUN.md) - 启动方式与阿里云部署

## 贡献指南

我们欢迎所有形式的贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目。

### 贡献步骤

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 路线图

- [x] 基础写作功能
- [x] AI 续写和对话
- [x] 世界观构建
- [x] 多 AI 提供商支持
- [x] Docker 容器化部署
- [ ] 协作写作
- [ ] 版本控制增强
- [ ] 移动端适配
- [ ] 插件系统
- [ ] 多语言支持

## 许可证

本项目采用 [MIT 许可证](LICENSE) 开源。

## 致谢

- [FastAPI](https://fastapi.tiangolo.com/) - 高性能 Web 框架
- [React](https://react.dev/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [OpenAI](https://openai.com/) - AI 模型提供商
- [ChromaDB](https://www.trychroma.com/) - 向量数据库

Built with ❤️ for writers everywhere.

## 联系方式

- 项目主页：<https://github.com/dession-wu/ai_novel_agent>
- 问题反馈：<https://github.com/dession-wu/ai_novel_agent/issues>
- GitHub Pages：<https://dession-wu.github.io/ai_novel_agent/>
- 邮箱：dession_w@163.com

## Project Links

- **Project Home**: https://github.com/dession-wu/ai-novel-agent
- **GitHub Pages**: https://dession-wu.github.io/ai_novel_agent
- **Issue Tracker**: https://github.com/dession-wu/ai-novel-agent/issues
- **Email Contact**: dession_w@163.com

**Ready to transform your writing? Start with NOVA today!**