# Library Management System

A full-stack web application for managing a library — browse books, checkout/return, track members, and calculate late fees.

## Features

- **Book Catalog** — Search and filter by title, author, ISBN, or genre
- **Checkout System** — Issue books to members with date tracking
- **Returns Processing** — Calculate late fees ($1.50/day after 14 days)
- **Member Management** — Add members and track their activity
- **Statistics Dashboard** — Total books, members, checked out, overdue, fees
- **Cloud Sync** — Vercel serverless API with localStorage fallback

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Backend:** Node.js (Vercel Serverless Functions)
- **Storage:** In-memory (API) / localStorage (offline)
- **Deployment:** Vercel

## Getting Started

### Local Development

```bash
# Open index.html in browser (works with localStorage fallback)
open index.html
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Docker

```bash
docker build -t library-mgmt .
docker run -p 3000:3000 library-mgmt
```

## API

The serverless endpoint (`/api/server`) exposes:

| Method | Route                  | Description                       |
|--------|------------------------|-----------------------------------|
| GET    | /api/server            | Full data snapshot                |
| GET    | /api/server/summary | Library counts        |
| GET    | /api/server/checkouts | Checkouts w/ names    |
| GET    | /api/server/books/search?q= | Search books (title/author/genre) |
| GET    | /api/server/books/:id  | One book                          |
| GET    | /api/server/members/:id| One member                        |
| POST   | /api/server/books      | Create a book                     |
| POST   | /api/server/members    | Create a member                   |
| POST   | /api/server/books/:id/toggle | Toggle availability         |
| DELETE | /api/server/books/:id  | Delete a book                     |
| DELETE | /api/server/members/:id| Delete a member                   |
| POST   | /api/server/checkout   | Check out a book                  |
| POST   | /api/server/return/:checkoutId | Return a book              |
| POST   | /api/server            | Bulk replace (offline sync)       |

## License

MIT License - see [LICENSE](LICENSE) for details
