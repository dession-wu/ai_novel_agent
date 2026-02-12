# NOVA: Novel Origination & Visualization Assistant

<div align="center">
  <img src="logo.png" alt="NOVA Logo" width="200" height="200">
  
  <div class="mt-4 flex flex-wrap justify-center gap-2">
    <img src="https://img.shields.io/badge/Python-3.12+-blue.svg" alt="Python">
    <img src="https://img.shields.io/badge/FastAPI-0.100+-green.svg" alt="FastAPI">
    <img src="https://img.shields.io/badge/React-18+-61DAFB.svg" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
    <img src="https://img.shields.io/github/stars/yourusername/nova.svg?style=social" alt="Stars">
  </div>
</div>

## The Problem

Every writer faces the same demons:

- ✗ Staring at a blank page, waiting for inspiration
- ✗ Getting stuck in plot holes and character inconsistencies
- ✗ Spending hours on tedious proofreading
- ✗ Struggling to maintain consistent worldbuilding
- ✗ Sacrificing quality for quantity to meet deadlines
- ✗ Losing track of your creative vision

## The Solution

NOVA is your AI-powered writing companion that transforms the creative process from a struggle to a joyride.

## Key Features

### 🚀 Intelligent Narrative Engine
- **AI-powered Continuation**: Seamlessly extends your story while preserving style and voice
- **Contextual Understanding**: Deep comprehension of your narrative world
- **Style Adaptation**: Mimics your unique writing style across genres

### 🌍 Worldbuilding Mastery
- **Visual World Bible**: Interactive management of characters, locations, and rules
- **Consistency Guardian**: Automatically detects and resolves contradictions
- **Timeline Management**: Visualize and track story events

### 🧠 Smart Proofreading
- **Grammar & Style**: Professional-level language refinement
- **Logic Checking**: Identifies plot holes and character inconsistencies
- **Feedback Engine**: Constructive suggestions for improvement

### 📚 Project Management
- **Multi-novel Support**: Organize all your creative projects
- **Version Control**: Track changes and revert to previous drafts
- **Progress Analytics**: Visualize your writing journey and productivity

### 🎨 AI Model Fusion
- **Multi-provider Integration**: OpenAI GPT-4, Claude, DeepSeek
- **Model Optimization**: Intelligent selection based on task type
- **Custom Prompts**: Fine-tune AI behavior for your specific needs

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/dession-wu/ai-novel-agent.git
cd ai-novel-agent

# 2. Start the service
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py

# 3. Open your browser
echo "Visit http://localhost:8000"
```

## Use Cases

### 📖 Professional Novelist
**Scenario**: You're working on a fantasy trilogy and need to maintain consistent worldbuilding across 30+ chapters.
**Solution**: Use NOVA's World Bible to manage all characters, locations, and rules, while the Consistency Guardian ensures no plot holes.

### 📱 Web Novel Author
**Scenario**: You need to publish 5 chapters per week to maintain reader engagement.
**Solution**: Leverage AI continuation during writer's block and use the Project Management features to schedule and track your publishing pipeline.

### 🎬 Content Creator
**Scenario**: You're a YouTube scriptwriter needing compelling narratives for your storytelling channel.
**Solution**: Use NOVA to generate story outlines, flesh out characters, and ensure narrative consistency across multiple videos.

## Installation

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### Full Installation Guide
See [INSTALLATION.md](docs/INSTALLATION.md) for detailed instructions.

## Architecture

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

## Contributing

We welcome contributions from the community! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built with ❤️ for writers everywhere.

---

## Project Links

- **Project Home**: https://github.com/dession-wu/ai-novel-agent
- **GitHub Pages**: https://dession-wu.github.io/ai_novel_agent
- **Issue Tracker**: https://github.com/dession-wu/ai-novel-agent/issues
- **Email Contact**: dession_w@163.com

**Ready to transform your writing? Start with NOVA today!**