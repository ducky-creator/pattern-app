# Pattern

Pattern is a minimal Next.js + Firebase app for logging daily triggers, emotions, and actions taken.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your Firebase values.

Optional:
- Add `OPENAI_API_KEY` to enable server-side neuroscience insights.
- Override `OPENAI_MODEL` if needed.

3. Start the app:

```bash
npm run dev
```

## Included

- App Router project structure
- Dark minimal dashboard UI
- `POST /api/entries` for saving entries
- `GET /api/entries` for listing recent entries
- Firestore Admin SDK integration with local in-memory fallback
