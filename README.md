# CODE DEBUGGING Platform ⚡

A production-ready full-stack online debugging competition platform built for **Dev Dynasty Club**, engineered to host 30–50 concurrent participants with real-time leaderboard sync, multi-language Monaco IDE support, and automated anti-cheat telemetry.

---

## 🚀 Key Features

### 👨‍💻 Participant Experience
- **Authentication**: Secure JWT Login & Registration system with organization profile tagging.
- **Rules & Fullscreen Lock**: Interactive instructions page with mandatory fullscreen prompt before entering the competition.
- **VS Code Monaco Editor**: Multi-language support (**Java, Python, C, C++**) with auto-save to `localStorage` + backend state, syntax themes, line numbers, and resetting to original buggy templates.
- **Test Case Evaluator**: Separate "Run Code" (sample test cases) and "Submit Solution" (hidden evaluation suite) actions.
- **Live Contest Timer**: Countdown clock synced via WebSocket with warning states when low on time.
- **Confetti Celebration & Scorecard**: Interactive result summary with certificate preview.

### 🛡️ Anti-Cheat Engine
- **Fullscreen Enforcement**: Locks participant workspace into full-screen mode; prompts immediate restoration overlay on exit.
- **Tab & Window Blur Monitoring**: Listens for `visibilitychange` and window `blur` events.
- **Prohibited User Actions**: Disables right-click context menu (`contextmenu`), copying (`copy`), pasting (`paste`), and DevTools shortcuts (F12, Ctrl+Shift+I/J/C).
- **Auto Disqualification & Auto Submit**: Automatically locks editor and submits current code buffer upon breaching maximum violation threshold (5 warnings).
- **Real-Time Telemetry Stream**: Emits live violation alerts directly to Admin dashboard via Socket.io.

### 👑 Admin Suite
- **Control Dashboard**: Live participant count, submission counts, total anti-cheat alerts.
- **Contest Master Controls**: Real-time Start, Pause, Resume, End contest state machine, duration setter, and live announcement broadcaster.
- **Question CRUD**: Full modal interface to add, edit, and delete debugging challenges with custom buggy code templates and test cases.
- **Participant Monitor**: Real-time telemetry feed of connected participants, scores, solved counts, warning indicators, and violation logs.
- **Results Export**: 1-click CSV export of final competition rankings and participant statistics.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 / 18, Vite, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Framer Motion, React Hot Toast, Lucide Icons, Axios, Socket.io Client.
- **Backend**: Node.js, Express.js, MongoDB Atlas (with automatic in-memory fallback store), Socket.io, JWT Authentication, Bcryptjs, CORS, Dotenv.

---

## 🏃 Running the Application

### 1. Install Dependencies
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Start Servers
```bash
# Terminal 1: Start Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Start Frontend Dev Server (Port 5173)
cd client
npm run dev
```

Open your browser at `http://localhost:5173` to experience **CODE DEBUGGING**.

### 🔑 Demo Admin Credentials
- **Email**: `admin@devdynasty.com`
- **Password**: `admin123`
