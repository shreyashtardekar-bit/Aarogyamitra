# 🤝 Contributing to ArogyaMitra

Thank you for your interest in contributing to **ArogyaMitra** — an AI-powered health & wellness platform! Every contribution, big or small, is valued and appreciated.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Guidelines](#development-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [What to Contribute](#what-to-contribute)
- [Testing](#testing)
- [Code of Conduct](#code-of-conduct)

---

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/arogyamitra.git
   cd arogyamitra
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/arogyamitra.git
   ```

---

## 🛠️ Development Setup

### Backend (FastAPI + Python)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your API keys (GROQ_API_KEY, SPOONACULAR_API_KEY, etc.)
```

### Frontend (React + Vite + TypeScript)

```bash
cd frontend
npm install
```

### Running locally

```bash
# Terminal 1 — Start backend
cd backend
python -m uvicorn main:app --reload --port 8000

# Terminal 2 — Start frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` to view the app.

---

## 📐 Development Guidelines

### Code Style

- **Python (Backend):** Follow [PEP 8](https://peps.python.org/pep-0008/). Use type hints wherever possible.
- **TypeScript/React (Frontend):** Follow ESLint rules (`npm run lint`). Prefer functional components and hooks.
- Use clear, descriptive variable and function names.
- Add comments for any complex logic.

### Project Structure

```
arogyamitra/
├── backend/           # FastAPI backend
│   ├── routers/       # API route handlers
│   ├── services/      # Business logic & AI services
│   ├── schemas.py     # Pydantic models
│   └── database.py    # SQLAlchemy models
└── frontend/          # React + Vite frontend
    └── src/
        ├── pages/     # Route-level page components
        ├── components/ # Shared UI components
        ├── services/  # API client
        └── store/     # Zustand state management
```

---

## ✏️ Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

| Prefix | Purpose |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Formatting (no logic change) |
| `refactor:` | Code restructuring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance / dependency updates |

**Examples:**
```
feat: add YouTube recipe video links to meal plan
fix: resolve token expiration middleware issue
docs: update local setup instructions
style: standardize button hover states across pages
```

---

## 🔁 Pull Request Process

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit with meaningful messages.

3. **Keep your branch up to date:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** on GitHub with:
   - A clear **title** and **description**
   - **Screenshots** for any UI changes
   - Steps to **test your changes**
   - Reference any related GitHub issues (e.g., `Closes #42`)

---

## 💡 What to Contribute

### Good First Issues
- 🐛 Bug fixes and error handling improvements
- 📝 Documentation clarity improvements
- 🎨 UI/UX polishing and dark theme enhancements
- ✅ Writing unit or integration tests
- 🌐 Adding i18n/multilingual support

### Feature Ideas
- 📊 Advanced analytics and progress charts
- 🔔 Push notifications for meal/workout reminders
- 🤝 Community features (sharing plans, leaderboards)
- 🫀 Wearable device integrations (Apple Watch, Fitbit)
- 📷 Barcode scanner for food tracking
- 🧬 Personalized health risk reports

---

## 🧪 Testing

Before submitting your pull request, make sure:

- ✅ Backend starts without errors: `uvicorn main:app --reload`
- ✅ Frontend builds without errors: `npm run build`
- ✅ All AI endpoints respond correctly
- ✅ No console errors in the browser
- ✅ Your changes don't break existing functionality

---

## 📬 Need Help?

- 📖 Read the [README.md](README.md) for project overview
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for hosting instructions
- 🛠️ See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- 💬 Open a GitHub Issue with the `question` label

---

## 🤲 Code of Conduct

We are committed to a welcoming, inclusive, and respectful community.

- Be kind and respectful to all contributors
- Provide constructive, specific feedback in reviews
- Support and uplift new contributors
- Report harmful behavior to the maintainers

---

**Thank you for contributing to ArogyaMitra! Together, we're building a healthier world. 🌿**
