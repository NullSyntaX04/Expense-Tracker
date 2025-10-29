# Expense-Tracker

# A simple and intuitive expense tracker app to record income and expenses, categorize spending, and visualize financial insights with interactive charts.

# Personal Expense Tracker - Fullstack (React + Vite frontend, Node + Express backend, MongoDB Atlas)

This archive contains a ready-to-run fullstack project.

## Quick start (local development)

1. Extract the archive and open two terminals.

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGO_URI, JWT secrets, CLIENT_URL
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Notes

- The backend expects environment variables (see .env.example).
- MongoDB Atlas: create user & cluster, set MONGO_URI accordingly.
- Refresh token is stored in an httpOnly cookie; access token is kept in React state (memory).
- For production, secure the env secrets, restrict Atlas IP access, and ensure HTTPS.
