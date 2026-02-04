# AI Novel Agent System 一键启动指南

## 一、脚本介绍

本项目提供了一键启动脚本，用于快速启动AI Novel Agent System的后端和前端服务。脚本会自动处理依赖安装和服务启动，简化用户的操作流程。

## 二、脚本类型

### 1. Windows批处理脚本
- 文件名称：`start_all.bat`
- 适用系统：Windows 7/8/10/11
- 使用方式：双击运行或在命令行执行

### 2. PowerShell脚本
- 文件名称：`start_all.ps1`
- 适用系统：Windows 10/11
- 使用方式：右键 "以管理员身份运行" 或在PowerShell中执行

## 三、使用方法

### 方法1：双击运行

1. **Windows批处理脚本**：
   - 直接双击 `start_all.bat` 文件
   - 等待脚本执行，自动安装依赖并启动服务

2. **PowerShell脚本**：
   - 右键点击 `start_all.ps1` 文件
   - 选择 "以管理员身份运行"
   - 如果出现执行策略提示，选择 "是"

### 方法2：命令行执行

1. **Windows批处理脚本**：
   ```bash
   # 在项目根目录执行
   start_all.bat
   ```

2. **PowerShell脚本**：
   ```powershell
   # 在项目根目录执行
   .\start_all.ps1
   ```

## 四、脚本执行流程

1. **环境检查**：
   - 检查Python是否安装（要求3.10+）
   - 检查Node.js是否安装（要求16+）
   - 检查npm是否安装

2. **依赖安装**：
   - 后端：自动安装 `requirements.txt` 中的依赖
   - 前端：自动安装 `package.json` 中的依赖

3. **服务启动**：
   - 后端服务：在8000端口启动
   - 前端服务：在5173端口启动

4. **日志记录**：
   - 安装日志：`logs/backend_install.log`、`logs/frontend_install.log`
   - 运行日志：`logs/backend.log`、`logs/frontend.log`

## 五、服务访问地址

| 服务类型 | 访问地址 | 说明 |
|---------|---------|------|
| 后端API | http://localhost:8000 | 后端服务主地址 |
| API文档 | http://localhost:8000/api/v1/docs | Swagger UI文档 |
| 前端应用 | http://localhost:5173 | 前端管理界面 |
| Prometheus监控 | http://localhost:8000/metrics | 监控指标 |

## 六、注意事项

### 1. 首次运行
- 首次运行时，脚本会安装所有依赖，可能需要较长时间
- 请确保网络畅通，以便下载依赖包

### 2. 端口占用
- 确保端口8000（后端）和5173（前端）未被占用
- 如果端口被占用，脚本会启动失败，需要手动关闭占用端口的程序

### 3. 执行权限
- PowerShell脚本可能需要管理员权限才能执行
- 如果出现 "无法加载文件" 错误，请检查PowerShell执行策略

### 4. 环境变量
- 确保Python和Node.js已添加到系统PATH环境变量中
- 可以通过 `python --version` 和 `node --version` 验证

## 七、常见问题解决

### 1. PowerShell执行策略问题

**问题**："无法加载文件 start_all.ps1，因为在此系统上禁止运行脚本"

**解决方案**：
```powershell
# 以管理员身份运行PowerShell，执行以下命令
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. 依赖安装失败

**问题**：安装依赖时出现网络错误或权限错误

**解决方案**：
- 检查网络连接
- 尝试手动安装依赖
- 后端：`python -m pip install -r requirements.txt --user`
- 前端：`cd frontend && npm install --legacy-peer-deps`

### 3. 端口被占用

**问题**：服务启动失败，提示端口已被占用

**解决方案**：
```powershell
# 查找占用端口的进程
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# 根据PID结束进程
taskkill /F /PID <进程ID>
```

### 4. 日志查看

**问题**：需要查看详细的安装或运行日志

**解决方案**：
- 安装日志：查看 `logs/backend_install.log` 和 `logs/frontend_install.log`
- 运行日志：查看 `logs/backend.log` 和 `logs/frontend.log`

## 八、手动启动方式

如果一键启动脚本出现问题，可以尝试手动启动服务：

### 1. 手动启动后端
```bash
# 安装依赖
python -m pip install -r requirements.txt

# 启动服务
python main.py
```

### 2. 手动启动前端
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 九、停止服务

### 1. 停止后端服务
- 在后端服务的控制台窗口中，按 `Ctrl + C`

### 2. 停止前端服务
- 在前端服务的控制台窗口中，按 `Ctrl + C`

### 3. 强制结束进程
```powershell
# 结束所有Python进程
taskkill /F /IM python.exe

# 结束所有Node.js进程
Taskkill /F /IM node.exe
```

## 十、开发环境建议

1. **IDE推荐**：
   - 后端：PyCharm、VS Code
   - 前端：VS Code

2. **浏览器推荐**：
   - Chrome（推荐）、Firefox、Edge

3. **开发流程**：
   - 先启动后端服务
   - 再启动前端服务
   - 访问 `http://localhost:5173` 开始开发

## 十一、生产环境部署

### 1. 后端生产部署
```bash
# 使用gunicorn或uvicorn部署
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 2. 前端生产部署
```bash
# 构建生产版本
npm run build

# 使用nginx或其他Web服务器部署
# 将dist目录部署到Web服务器
```

## 总结

一键启动脚本简化了AI Novel Agent System的启动流程，适合开发和测试环境使用。脚本会自动处理依赖安装和服务启动，用户只需等待服务启动完成，即可访问相应的服务地址。

如果脚本出现问题，可以尝试手动启动服务，或查看日志文件定位问题。对于生产环境，建议使用更稳定的部署方式。
