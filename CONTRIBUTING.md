# 贡献指南

感谢您对 AI Novel Agent 项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 报告 Bug
- 提出新功能建议
- 提交代码修复
- 改进文档
- 分享使用经验

## 如何贡献

### 报告 Bug

如果您发现了 Bug，请通过 [GitHub Issues](https://github.com/yourusername/ai-novel-agent/issues) 报告，并包含以下信息：

1. **问题描述**：清晰描述 Bug 的表现
2. **复现步骤**：详细说明如何复现该问题
3. **期望行为**：描述您期望的正确行为
4. **环境信息**：
   - 操作系统及版本
   - Python 版本
   - Node.js 版本
   - 浏览器及版本（如果是前端问题）
5. **错误日志**：相关的错误信息或截图

### 提出新功能

如果您有新功能建议，请：

1. 先搜索现有 Issues，避免重复建议
2. 创建新的 Issue，使用 "Feature Request" 标签
3. 详细描述功能的用途和实现思路
4. 如果可能，提供 mockup 或示例

### 提交代码

#### 开发环境设置

1. **Fork 仓库**
   ```bash
   git clone https://github.com/yourusername/ai-novel-agent.git
   cd ai-novel-agent
   ```

2. **创建虚拟环境**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # 或
   venv\Scripts\activate  # Windows
   ```

3. **安装依赖**
   ```bash
   pip install -r requirements.txt
   cd frontend && npm install && cd ..
   ```

4. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/bug-description
   ```

#### 代码规范

**Python 代码规范**
- 遵循 [PEP 8](https://www.python.org/dev/peps/pep-0008/) 规范
- 使用类型注解
- 编写 docstring 文档
- 最大行长度：100 字符

**TypeScript/React 代码规范**
- 使用 ESLint 和 Prettier 进行代码格式化
- 使用函数式组件和 Hooks
- 组件名使用 PascalCase
- 变量和函数名使用 camelCase

**提交信息规范**
使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型说明：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat(ai): 添加 DeepSeek API 支持

- 实现 DeepSeekProvider 类
- 添加配置选项
- 更新文档

Closes #123
```

#### 测试

在提交代码前，请确保：

1. **运行后端测试**
   ```bash
   pytest tests/ -v
   ```

2. **运行前端测试**
   ```bash
   cd frontend
   npm test
   ```

3. **代码类型检查**
   ```bash
   # Python
   mypy app/
   
   # TypeScript
   cd frontend
   npm run type-check
   ```

4. **代码格式化**
   ```bash
   # Python
   black app/ tests/
   isort app/ tests/
   
   # TypeScript
   cd frontend
   npm run lint
   npm run format
   ```

#### 提交 Pull Request

1. **推送到您的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **创建 Pull Request**
   - 标题清晰描述变更内容
   - 详细描述变更的原因和影响
   - 关联相关的 Issue
   - 确保所有 CI 检查通过

3. **PR 审查流程**
   - 维护者会审查您的代码
   - 可能需要根据反馈进行修改
   - 通过审查后会被合并到主分支

## 项目结构说明

```
ai-novel-agent/
├── app/                    # Python 后端
│   ├── api/               # API 路由
│   ├── core/              # 核心配置
│   ├── models/            # 数据模型
│   ├── schemas/           # Pydantic 模式
│   └── services/          # 业务逻辑
├── frontend/              # React 前端
│   └── src/
│       ├── components/    # 组件
│       ├── pages/         # 页面
│       └── services/      # 前端服务
├── docs/                  # 文档
├── tests/                 # 测试文件
└── ...
```

## 开发指南

### 后端开发

**添加新 API 端点**
1. 在 `app/api/api_v1/endpoints/` 创建新的端点文件
2. 在 `app/api/api_v1/api.py` 注册路由
3. 在 `app/schemas/` 创建请求/响应模式
4. 添加相应的测试

**添加新服务**
1. 在 `app/services/` 创建服务类
2. 实现业务逻辑
3. 在端点中调用服务
4. 编写单元测试

### 前端开发

**添加新页面**
1. 在 `frontend/src/pages/` 创建页面组件
2. 在 `App.tsx` 添加路由
3. 在侧边栏添加导航项
4. 实现页面功能

**添加新组件**
1. 在 `frontend/src/components/` 创建组件
2. 如果是通用组件，放在 `ui/` 子目录
3. 编写组件文档和测试

## 文档贡献

文档改进也是非常重要的贡献！您可以：

- 修正文档中的错误
- 添加使用示例
- 改进文档结构
- 翻译文档

文档位于 `docs/` 目录和 README.md 文件中。

## 行为准则

参与本项目时，请遵守以下行为准则：

1. **尊重他人**：友善、耐心地对待所有参与者
2. **包容开放**：欢迎来自不同背景和经验水平的贡献者
3. **建设性讨论**：专注于问题本身，而非个人
4. **接受批评**：虚心接受反馈和建议
5. **关注社区**：优先考虑整个社区的利益

## 获取帮助

如果您在贡献过程中需要帮助：

- 查看 [README.md](README.md) 中的文档链接
- 搜索 [Issues](https://github.com/yourusername/ai-novel-agent/issues) 中的类似问题
- 创建新的 Issue 提问
- 加入我们的社区讨论

## 致谢

感谢所有为 AI Novel Agent 做出贡献的开发者！

---

如有任何问题或建议，欢迎随时联系我们！
