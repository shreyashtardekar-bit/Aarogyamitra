<div align="center">

# 🌿 ArogyaMitra

### Your AI-Powered Personal Health & Wellness Companion

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Powered-F55036?style=for-the-badge)](https://console.groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**ArogyaMitra** (आरोग्यमित्र — *"Friend of Health"* in Sanskrit) is a full-stack AI-powered health and wellness platform that provides personalized meal plans, workout routines, real-time AI coaching, and holistic wellness insights — all wrapped in a stunning premium dark-theme UI.

[Live Demo](#) · [Report Bug](https://github.com/YOUR_USERNAME/arogyamitra/issues) · [Request Feature](https://github.com/YOUR_USERNAME/arogyamitra/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AROMI AI Coach** | Real-time AI health coaching powered by Groq's LLaMA 3 — ask anything, get instant personalized advice |
| 🥗 **AI Meal Planner** | Generate 7-day personalized Indian cuisine meal plans with macros, calories, and recipe cards |
| 💪 **AI Workout Creator** | Custom workout plans tailored to your fitness level, goals, and available equipment |
| 📊 **Progress Tracking** | Log and visualize weight, body measurements, and fitness milestones over time |
| 🏆 **Achievements System** | Unlock badges and earn points as you reach health milestones |
| 🌿 **Wellness Plans** | Holistic 360° wellness plans covering mental health, sleep, hydration, and more |
| 📹 **Recipe Video Links** | YouTube tutorial videos for every recipe in your meal plan |
| 🔐 **Secure Auth** | JWT-based authentication with 256-bit encryption for your health data |

---

## 🖼️ Screenshots

> *Premium dark-theme UI crafted for the modern health-conscious user.*

| Login | Dashboard | Nutrition |
|-------|-----------|-----------|
| ![Login Page](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Nutrition](docs/screenshots/nutrition.png) |

---

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — High-performance Python API framework
- **[SQLAlchemy](https://www.sqlalchemy.org/)** + **SQLite** — ORM and database
- **[Groq AI](https://console.groq.com/)** — Ultra-fast LLaMA 3 inference for AI features
- **[Spoonacular API](https://spoonacular.com/food-api)** — Recipe and nutrition data
- **[YouTube Data API v3](https://developers.google.com/youtube/v3)** — Recipe video tutorials
- **JWT** — Secure token-based authentication

### Frontend
- **[React 18](https://reactjs.org/)** + **[Vite](https://vitejs.dev/)** — Blazing-fast frontend
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Zustand](https://github.com/pmndrs/zustand)** — Lightweight state management
- **[Recharts](https://recharts.org/)** — Beautiful data visualization
- **[Lucide React](https://lucide.dev/)** — Premium icon set

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **npm** or **yarn**
- A free [Groq API Key](https://console.groq.com/)
- A free [Spoonacular API Key](https://spoonacular.com/food-api)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/arogyamitra.git
cd arogyamitra
```

### 2. Set up the Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Edit `backend/.env` with your API keys:

```env
GROQ_API_KEY=your_groq_api_key_here
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
YOUTUBE_API_KEY=your_youtube_data_api_key_here
SECRET_KEY=your_secure_random_secret_key
```

Start the backend server:

```bash
python -m uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000` · Docs at `http://localhost:8000/docs`

### 3. Set up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be live at `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
arogyamitra/
├── backend/
│   ├── routers/            # API route handlers
│   │   ├── users.py        # Auth & user management
│   │   ├── meals.py        # Meal plan generation
│   │   ├── workout.py      # Workout plan generation
│   │   ├── coach.py        # AI Coach chat
│   │   └── progress.py     # Progress & achievements
│   ├── services/
│   │   ├── groq_service.py       # Groq AI integration
│   │   ├── spoonacular_service.py # Recipe data
│   │   └── youtube_service.py    # YouTube video search
│   ├── database.py         # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── main.py             # FastAPI app entry point
│   └── .env.example        # Environment variable template
│
└── frontend/
    └── src/
        ├── pages/          # Route-level page components
        │   ├── Dashboard.tsx
        │   ├── MealPlan.tsx
        │   ├── Workout.tsx
        │   ├── AICoach.tsx
        │   ├── Progress.tsx
        │   └── WellnessPlan.tsx
        ├── components/     # Shared UI components
        ├── services/       # Axios API client
        └── store/          # Zustand global state
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | Groq API key for AI features |
| `SPOONACULAR_API_KEY` | ✅ | Spoonacular key for recipe data |
| `YOUTUBE_API_KEY` | ⭕ | YouTube Data API v3 key for recipe videos |
| `SECRET_KEY` | ✅ | JWT signing secret (use a strong random string) |
| `DATABASE_URL` | ⭕ | Defaults to `sqlite:///./arogyamitra.db` |
| `CORS_ORIGINS` | ⭕ | Allowed frontend origins (default: `http://localhost:5173`) |

---

## 📖 API Reference

Full interactive API documentation is auto-generated by FastAPI:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Log in and receive JWT |
| `POST` | `/meals/generate` | Generate an AI meal plan |
| `POST` | `/workout/generate` | Generate an AI workout plan |
| `POST` | `/coach/chat` | Send a message to AROMI Coach |
| `GET` | `/progress/entries` | Fetch progress log entries |
| `GET` | `/progress/achievements` | Fetch unlocked achievements |

---

## 🤝 Contributing

Contributions are welcome and appreciated! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started, coding standards, commit conventions, and the pull request process.

---

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions on deploying ArogyaMitra to a production server using Nginx, SystemD, SSL certificates, Docker, and PostgreSQL.

---

## 🐛 Troubleshooting

Running into issues? Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions to the most common problems, or [open an issue](https://github.com/YOUR_USERNAME/arogyamitra/issues).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

- [Groq](https://groq.com/) for blazing-fast AI inference
- [Spoonacular](https://spoonacular.com/) for comprehensive recipe data
- [Lucide](https://lucide.dev/) for the beautiful icon library
- The open-source community for the amazing tools that power this project

---

<div align="center">

**Built with ❤️ for a healthier India.**

*ArogyaMitra — आरोग्यमित्र*

</div>
#   A a r o g y a m i t r a 
 
 
