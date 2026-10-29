# DebugMate AI — Error Message Debugging Helper Using LLM

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_API-4285F4.svg?style=flat&logo=google)](https://ai.google.dev)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com)

**DebugMate AI** is a modern, full-stack, developer-first web application designed to help students, beginner programmers, and engineers decipher complex compiler errors, stack traces, and runtime exceptions.

Powered by Google Gemini and backed by FastAPI and Supabase PostgreSQL, DebugMate AI breaks down opaque errors into simple explanations, diagnoses root causes, points out exact error lines, provides step-by-step resolution checklists, and renders side-by-side Monaco diff comparisons alongside an interactive AI follow-up tutor.

---

## 🌟 Key Features

### 1. ⚡ AI Error Analyzer
- **Multi-Language Support**: Full support for Python, JavaScript, TypeScript, Java, C, C++, SQL, Go, Rust, HTML, CSS, PHP, and Ruby.
- **Categorized Ingestion**: Classifies by Syntax, Runtime Exception, Compilation, Logic, Dependency / Import, or Database errors.
- **Interactive Monaco Code Editor**: Dark-themed Monaco Editor with live syntax highlighting, bracket matching, line numbers, and full-screen expand mode.
- **Stack Trace & Error Ingestion**: Handles raw compiler outputs, multi-frame tracebacks, and runtime exception logs.

### 2. 🔍 Comprehensive Debugging Diagnostics
Every analysis returns a structured, 9-point breakdown:
1. **Error Summary**: Beginner-friendly, plain-English explanation of what went wrong.
2. **Root Cause**: Deep technical explanation of why the interpreter or compiler threw the error.
3. **Identified Location**: Pinpointed file, line number, or syntax token.
4. **Step-by-Step Solution**: Actionable checklist guiding the developer to fix the issue.
5. **Corrected Code**: Clean corrected snippet with one-click **Copy Code** and **Apply to Editor** buttons.
6. **Side-by-Side Code Diff**: Monaco Diff Editor showing additions (green) and deletions (red).
7. **Why the Fix Works**: Computer science concept breakdown (scoping, nullability, pointers, AST parsing).
8. **Prevention Tips**: Proactive coding guidelines and linting rules to prevent regressions.
9. **Confidence & Limitations Notice**: Transparent notice on assumptions and environmental factors.

### 3. 💬 Contextual AI Follow-Up Assistant
- Integrated chat assistant right beneath every analysis.
- Retains context of the specific error, language, original code, and diagnosis.
- Quick prompt chips:
  - *"Why did this error occur?"*
  - *"Explain the fix in simple terms"*
  - *"Can you provide another solution?"*
  - *"Explain the corrected code line by line"*
  - *"How can I prevent this error in the future?"*

### 4. 📚 Built-In Sample Error Library
Pre-configured, one-click benchmark errors ready for instant demonstration:
- **Python**: `NameError: name 'x' is not defined`
- **Python**: `IndexError: list index out of range`
- **JavaScript**: `TypeError: Cannot read properties of undefined (reading 'map')`
- **Java**: `NullPointerException` (Object dereference)
- **C / C++**: `use of undeclared identifier` & missing semicolon
- **SQL**: `Syntax error in SQL statement near 'FORM orders'`

### 5. 📊 Real-Time Analytics Dashboard
- Derived from real user records in the PostgreSQL database.
- Key metrics: Total Analyses Performed, Code Fixes Generated, Top Language Share.
- Interactive Recharts bar and proportional progress breakdown.
- Recent analysis feed with quick preview access.
- Welcoming empty state for first-time users.

### 6. 🕒 Debugging History & Search
- Full per-user history with search by title or error message.
- Filter by programming language.
- Re-inspect full diagnosis at any time.
- Single-record deletion with confirmation.

### 7. 🔒 Security & Privacy by Design
- **Zero Frontend Secrets**: Gemini API keys and Supabase service credentials stay exclusively on the backend.
- **Untrusted Code Isolation**: Code snippets and error messages are treated as inert strings—**no arbitrary code execution**.
- **Payload Limits**: 1MB maximum payload enforcement and request validation via Pydantic.
- **Supabase Row Level Security (RLS)**: Enforces that users can only read, create, or delete their own data.
- **Instant Demo Mode**: Includes guest mode so evaluators can run the entire workflow without creating third-party accounts first.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, `@monaco-editor/react`, `lucide-react`, `recharts`, `axios`, `react-markdown`, `canvas-confetti` |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2, `google-genai` / `google-generativeai`, `supabase-py`, `PyJWT` |
| **Database & Auth** | Supabase PostgreSQL, Supabase Authentication, Row Level Security (RLS) |
| **AI LLM** | Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`) |

---

## 📂 Project Structure

```
debugmate-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── dashboard.py     # Dashboard stats endpoint
│   │   │   │   ├── debug.py         # Analyze, chat, and history endpoints
│   │   │   │   └── health.py        # Health check endpoint
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic BaseSettings & env loader
│   │   │   └── security.py          # JWT verification & UserContext
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic request & response models
│   │   ├── services/
│   │   │   ├── debugger.py          # Debugging orchestration
│   │   │   ├── gemini_service.py    # Google Gemini LLM SDK integration
│   │   │   └── supabase_service.py  # Supabase client & fallback persistence
│   │   └── main.py                  # FastAPI application & CORS
│   ├── requirements.txt             # Python dependencies
│   ├── test_api.py                  # Automated backend test suite
│   ├── test_multilang.py            # Multi-language verification suite
│   └── .env.example                 # Backend environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx        # Login & Register modal
│   │   │   ├── CodeComparisonModal.jsx # Monaco Diff Editor
│   │   │   ├── CodeEditor.jsx       # Monaco Code Editor wrapper
│   │   │   ├── DiagnosisView.jsx    # 9-point structured analysis view
│   │   │   ├── FollowUpChat.jsx     # Contextual chat with quick chips
│   │   │   ├── Navbar.jsx           # App navigation & status indicators
│   │   │   └── Sidebar.jsx          # Tab navigation & info badge
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Supabase & guest authentication
│   │   │   └── NotificationContext.jsx # Toast notifications
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Real-time metrics & Recharts
│   │   │   ├── HistoryPage.jsx      # Searchable & filterable history
│   │   │   ├── SampleLibraryPage.jsx# 6 benchmark errors
│   │   │   ├── SettingsPage.jsx     # System health & API setup
│   │   │   └── WorkspacePage.jsx    # Main AI Error Analyzer workspace
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with auth interceptor
│   │   │   ├── sampleErrors.js      # Benchmark data definitions
│   │   │   └── supabase.js          # Supabase client wrapper
│   │   ├── App.jsx                  # Root state & tab routing
│   │   ├── index.css                # Tailwind CSS styling
│   │   └── main.jsx                 # Vite React entry point
│   ├── index.html                   # HTML template with JetBrains Mono
│   ├── package.json                 # Node.js dependencies
│   ├── tailwind.config.js           # Theme colors, fonts & shadows
│   └── vite.config.ts               # Vite proxy configuration
├── supabase/
│   ├── schema.sql                   # Profiles, debug_analyses, debug_chat_messages
│   └── policies.sql                 # Row Level Security (RLS) policies
├── .env.example                     # Unified environment template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js v18+** & **npm**
- *(Optional for live LLM)*: Free API Key from [Google AI Studio](https://aistudio.google.com/)
- *(Optional for cloud DB)*: Project from [Supabase](https://supabase.com/)

---

### Step 1: Clone and Set Up the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure your `.env` file:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key in `backend/.env`:
   ```ini
   GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
   GEMINI_MODEL=gemini-2.5-flash
   ```

5. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The backend will be live at `http://localhost:8000` (API documentation at `http://localhost:8000/api/docs`).*

---

### Step 2: Set Up the Frontend

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure frontend environment (optional):
   ```bash
   cp .env.example .env
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser at `http://localhost:5173`.*

---

### Step 3: Run Automated Backend Tests

To verify that all endpoints (Health, Analyze, Chat, History, Dashboard, Delete) function as expected:

```bash
cd backend
python test_api.py
python test_multilang.py
```

Expected output:
```
Running DebugMate AI Backend Tests...
Health response: 200 {'status': 'healthy', ...}
Analyze response status: 200
Chat response status: 200
History status: 200
Dashboard stats status: 200
Verified item 404 after deletion.
ALL TESTS PASSED SUCCESSFULLY! ✅
```

---

## 🗄️ Database Setup (Supabase)

If you wish to connect to an external Supabase PostgreSQL database:

1. Create a project at [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
4. Copy and run the contents of [`supabase/policies.sql`](supabase/policies.sql).
5. In your Supabase Project Settings -> API, retrieve your Project URL and Anon/Service Key, and place them in `backend/.env` and `frontend/.env`:
   ```ini
   SUPABASE_URL=https://<your-project>.supabase.co
   SUPABASE_KEY=<your-supabase-key>
   SUPABASE_JWT_SECRET=<your-jwt-secret>
   ```

> **Note:** If Supabase credentials are not provided, DebugMate AI seamlessly switches to an isolated local store so that saving history, chat, and dashboard statistics work 100% out-of-the-box for project demos.

---

## 🧪 Testing Checklist

- [x] **Backend Health Check**: `GET /api/health` returns healthy status and configurations.
- [x] **Error Analysis**: Ingests multi-line stack trace + code snippet, producing structured JSON.
- [x] **Monaco Code Comparison**: Live diff viewer with highlighted line-by-line additions/deletions.
- [x] **Interactive Chat**: Follow-up tutor answers contextual queries without repetitive boilerplate.
- [x] **Search & Filter History**: Search by keyword or filter by language; records delete cleanly.
- [x] **Dashboard Metrics**: Real-time frequency chart and resolution percentages.
- [x] **Sample Library**: 6 pre-configured error benchmarks loadable in 1 click.
- [x] **Responsive Layout**: Dark-themed UI with fluorescent green accents, mobile-friendly navigation.

---

## 📄 License
MIT License. Built for computer science students, educators, and developers.
