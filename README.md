<div align="center">

<img src="./public/favicon.svg" width="72" alt="NexaChat logo" />

# NexaChat

**Real-time messaging, reimagined for the modern web.**

Fast. Secure. Built to scale from one conversation to millions.

[![Status](https://img.shields.io/badge/status-in%20active%20development-orange?style=for-the-badge)](#-project-status)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](#-license)

[Live Demo](#) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

</div>

<br />

## ✨ Overview

**NexaChat** is a real-time messaging platform built on a modern React + Firebase stack — designed to feel as fluid and instant as the chat apps people already love, while staying lightweight enough to run entirely on serverless infrastructure.

It's built for a simple reason: most "learning project" chat apps stop at sending a message to a database. NexaChat is being built to go further — real authentication, structured data modeling, a real UI system, and an architecture that can grow into group chats, presence, and rich media without a rewrite.

> **This project is under active development.** Core messaging, authentication, and the dashboard UI are functional; group chats, media sharing, and real-time presence are in progress. See [Project Status](#-project-status) below for exactly what's shipped.

<br />

## 💡 Why This Project Matters

| | |
|---|---|
| 🏗️ **Production-shaped architecture** | Not a toy CRUD app — proper route-based structure, isolated Firebase service layer, and a component architecture built to scale past a single-file prototype. |
| ⚡ **Modern, fast tooling** | Vite 8 + React 19 for near-instant HMR and a build pipeline that stays fast as the codebase grows. |
| 🔐 **Real authentication, not a mock** | Firebase Auth with both email/password and Google OAuth — the same patterns used in production apps, not a fake login screen. |
| 🎨 **Designed, not just functional** | A custom dark, gradient-driven UI system — not an unstyled template. |
| 📈 **A genuine growth story** | Every commit is a real step: landing page → auth → dashboard → messaging → search → group chats. The roadmap below is being executed in public. |

<br />

## 🚀 Features

### ✅ Shipped
- **Landing page** — animated, gradient-driven marketing entry point
- **Authentication** — email/password signup & login, plus one-click Google sign-in via Firebase Auth
- **Persistent sessions** — auth-state listener keeps users signed in and routes them appropriately
- **Real-time dashboard** — conversation list, active chat panel, and message composer
- **Firestore-backed messaging** — messages are written to and read from Cloud Firestore per conversation
- **Contacts discovery** — pulls registered users from Firestore to start new conversations
- **Settings page** and a custom **404 page**
- **Client-side routing** via React Router 7

### 🛠️ In Progress
- Group conversations
- Message request / accept flow
- Global account search
- Real-time message listeners (moving from fetch-on-open to live `onSnapshot` streams)

### 🗺️ Planned
- Typing indicators & read receipts
- Media & file attachments
- Push notifications
- Voice/video calling (UI groundwork already in place)
- Mobile-responsive polish & PWA support

<br />

## 🧱 Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7 |
| **Build tooling** | Vite 8, ESLint 10 |
| **Backend / Data** | Firebase Authentication, Cloud Firestore |
| **Styling** | Hand-crafted CSS (no framework — full design control) |

</div>

<br />

## 📸 Preview

> Screenshots coming soon — the UI is evolving quickly. Check the [`dashboard`](./src/pages/dashboard) and [`signup`](./src/pages/signup) components for the current look.

<br />

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project (Auth + Firestore enabled)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/uzairbaigdev/NexaChat-.git
cd NexaChat-

# 2. Install dependencies
npm install

# 3. Configure Firebase
# Add your Firebase project config in src/firebaseConfig.js

# 4. Run the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

<br />

## 📁 Project Structure

```
NexaChat/
├── public/                # Static assets (favicon, icons)
└── src/
    ├── firebaseConfig.js  # Firebase Auth & Firestore setup
    ├── App.jsx            # Route definitions
    ├── main.jsx           # App entry point
    └── pages/
        ├── landingPage/   # Marketing landing page
        ├── signup/        # Account creation
        ├── login/         # Authentication
        ├── dashboard/      # Core chat experience
        ├── settings/       # User settings
        └── nofound/        # 404 fallback
```

<br />

## 📌 Project Status

NexaChat is a **work in progress**, developed iteratively and in the open. Expect rapid changes, occasional rough edges, and frequent new features. Feedback and issue reports are genuinely welcome — this is exactly the stage where they have the most impact on the project's direction.

<br />

## 🤝 Contributing

Contributions, ideas, and bug reports are welcome. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br />

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

<br />

<div align="center">

**Built by [uzairbaigdev](https://github.com/uzairbaigdev)**

If you find this project interesting, consider giving it a ⭐ — it helps a lot.

</div>
