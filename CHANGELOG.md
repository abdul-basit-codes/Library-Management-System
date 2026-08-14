# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-08-14

### Added
- `POST /api/checkout` endpoint (validates book + member, marks book unavailable)
- `POST /api/return/:checkoutId` endpoint (marks returned, frees the book)
- Seeded checkout record and availability tracking in the serverless API

## [1.0.0] - 2026-07-24

### Added
- Book catalog with search and genre filtering
- Book checkout system with member tracking
- Book returns with late fee calculation ($1.50/day after 14 days)
- Member management
- Statistics dashboard (total books, members, checked out, overdue, fees)
- Cloud sync with Vercel serverless API
- localStorage fallback for offline use
- Responsive design
- Dockerfile for containerized deployment
