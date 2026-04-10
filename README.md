# JobFlow — AI-Assisted Job Application Tracker

A full-stack MERN application for tracking job applications on a Kanban board. Paste a job description and let AI extract company details, required skills, and generate tailored resume bullet points.

![Stack](https://img.shields.io/badge/Stack-MERN-green) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4)

## Features

- **JWT Authentication** — Register/login with email and password. Sessions persist across page refreshes via localStorage.
- **Kanban Board** — Five columns (Applied, Phone Screen, Interview, Offer, Rejected) with drag-and-drop powered by `@hello-pangea/dnd`.
- **AI Job Description Parser** — Paste a JD, click "Parse with AI", and OpenAI extracts company name, role, skills, seniority, location, and salary range.
- **AI Resume Suggestions** — After parsing, get 3–5 tailored resume bullet points with copy buttons.
- **Full CRUD** — Create, view, edit, and delete applications. Change status by dragging cards or editing directly.
- **Error Handling** — Loading states, error states, empty states, and graceful API failure handling throughout.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State | Redux Toolkit |
| Drag & Drop | @hello-pangea/dnd |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| AI | Google Gemini API via OpenAI SDK (gemini-2.5-flash) |

## Architecture Decisions

1. **AI logic in a service layer** — `backend/src/services/aiService.ts` encapsulates all AI calls.
2. **Google Gemini instead of OpenAI** — I chose to use the significantly faster and more cost-effective Google Gemini (`gemini-2.5-flash`) model. I retained the `openai` SDK utilizing Google's OpenAI-compatibility endpoint to safely standardize the API structure and allow easy swapping between providers in the future.
3. **Resilient AI Error Handling** — Built an advanced retry loop and 500/503 status catcher that maps downstream Google server rate limits gracefully into the React frontend UI rather than crashing. 
4. **Redux Toolkit over React Query** — Chose RTK for global state consistency with optimistic drag-and-drop updates.
5. **Optimistic updates for DnD** — Card positions update instantly via `moveApplication` reducer, then sync to server. If the server call fails, the next `fetchApplications` corrects the state.
6. **Zod available for validation** — Included for potential request validation extension.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key (from Google AI Studio)

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd job-application-tracker

# Install all dependencies
npm run install:all

# Configure environment variables
cp .env.example backend/.env
# Edit backend/.env with your values:
#   MONGODB_URI=mongodb://localhost:27017/job-tracker
#   JWT_SECRET=<generate-a-secure-random-string>
#   GEMINI_API_KEY=<your-gemini-key>
#   CLIENT_URL=http://localhost:5173
```

### Run Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:
npm run dev:backend   # Express on port 5000
npm run dev:frontend  # Vite on port 5173
```

The frontend proxies `/api` requests to the backend automatically via Vite config.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port (default: 5000) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRES_IN` | Token expiration (default: 7d) | No |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `CLIENT_URL` | Frontend URL for CORS (default: http://localhost:5173) | No |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login with email/password
- `GET /api/auth/me` — Get current user (protected)

### Applications (all protected)
- `GET /api/applications` — List all applications
- `GET /api/applications/:id` — Get single application
- `POST /api/applications` — Create application
- `PUT /api/applications/:id` — Update application
- `PATCH /api/applications/:id/status` — Update status (for drag-and-drop)
- `DELETE /api/applications/:id` — Delete application

### AI (protected)
- `POST /api/ai/parse` — Parse job description and get resume suggestions

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/         # Database connection
│       ├── controllers/    # Route handlers
│       ├── middleware/      # Auth & error handling
│       ├── models/         # Mongoose schemas
│       ├── routes/         # Express routes
│       ├── services/       # AI service layer (OpenAI)
│       ├── types/          # TypeScript interfaces
│       └── server.ts       # Express app entry
├── frontend/
│   └── src/
│       ├── components/     # React components
│       │   ├── auth/       # Login/Register, ProtectedRoute
│       │   ├── board/      # Kanban board, columns, cards, modals
│       │   ├── common/     # Modal, Spinner
│       │   └── layout/     # Header
│       ├── hooks/          # Typed Redux hooks
│       ├── pages/          # Page components
│       ├── services/       # Axios API client
│       ├── store/          # Redux store & slices
│       ├── types/          # TypeScript types
│       └── utils/          # Helper functions
├── .env.example
├── .gitignore
└── README.md
```
