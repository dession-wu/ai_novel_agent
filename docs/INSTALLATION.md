# Installation Guide

## Prerequisites

Before installing NOVA, make sure you have the following software installed:

- **Python 3.12+**: Required for the backend server
- **Node.js 18+**: Required for the frontend development
- **Git**: For cloning the repository
- **A compatible operating system**: Windows, macOS, or Linux

## Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dession-wu/ai-novel-agent.git
cd ai-novel-agent
```

### 2. Set Up the Backend

#### Create and Activate Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the project root with the following content:

```env
# Database Configuration
DATABASE_URL=sqlite:///./sql_app.db

# Security Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI API Configuration
OPENAI_API_KEY=your-openai-api-key-here  # Optional
ANTHROPIC_API_KEY=your-anthropic-api-key-here  # Optional
DEEPSEEK_API_KEY=your-deepseek-api-key-here  # Optional

# Application Configuration
DEBUG=True
LOG_LEVEL=INFO

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Set Up the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Return to project root
cd ..
```

### 4. Start the Application

#### Development Mode

```bash
# Start the backend server (Terminal 1)
python main.py

# Start the frontend development server (Terminal 2)
cd frontend
npm run dev
```

#### Production Mode

```bash
# Build the frontend
cd frontend
npm run build
cd ..

# Start the production server
python main.py
```

## Accessing the Application

Once the servers are running, you can access NOVA at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Docker Installation (Alternative)

If you prefer using Docker, you can use the provided `docker-compose.yml` file:

### 1. Start with Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Stop the Application

```bash
docker-compose down
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Error: `Address already in use`
   - Solution: Stop other services using the same ports or modify the port configuration

2. **Missing Dependencies**
   - Error: `ModuleNotFoundError`
   - Solution: Make sure you've installed all dependencies with `pip install -r requirements.txt` and `npm install`

3. **Database Initialization**
   - Error: `Table not found`
   - Solution: Run `python app/init_db.py` to initialize the database

4. **API Key Issues**
   - Error: `No API key provided`
   - Solution: Add your API keys to the `.env` file
   - Note: You can still use basic features without API keys

### Logs

Check the logs for more detailed error information:

```bash
# Backend logs
python main.py  # Run in foreground to see logs

# Frontend logs
cd frontend
npm run dev  # Run in foreground to see logs
```

## Updating NOVA

To update NOVA to the latest version:

```bash
# Pull the latest changes
git pull origin main

# Update dependencies
pip install -r requirements.txt
cd frontend && npm install && cd ..

# Restart the application
# Follow the startup instructions above
```

## Uninstallation

To uninstall NOVA:

```bash
# Remove the project directory
cd ..
rm -rf ai_novel_agent

# Remove virtual environment (if created outside the project directory)
# rm -rf venv
```

## Support

If you encounter any issues during installation, please:

1. Check the [FAQ](FAQ.md) for common questions
2. Search the [GitHub Issues](https://github.com/dession-wu/ai-novel-agent/issues) for similar problems
3. Create a new [Issue](https://github.com/dession-wu/ai-novel-agent/issues/new) if you can't find a solution

---

## System Requirements

### Minimum Requirements
- **CPU**: 2-core processor
- **RAM**: 4GB
- **Storage**: 2GB free space
- **Network**: Internet connection (for AI API access)

### Recommended Requirements
- **CPU**: 4-core processor or better
- **RAM**: 8GB or more
- **Storage**: 4GB free space
- **Network**: Stable internet connection with sufficient bandwidth

---

## Next Steps

After successful installation, check out the [Getting Started](GETTING_STARTED.md) guide to learn how to use NOVA effectively.