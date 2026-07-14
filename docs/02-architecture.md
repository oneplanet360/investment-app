# 02 - Architecture

## Technology Stack

### Backend
- **Node.js** with **Express.js** API framework.
- **TypeScript** for static typing.
- **MongoDB** via **Mongoose** for NoSQL data persistence.
- **JWT** (JSON Web Tokens) for HTTP-only cookie session management.
- **Bcryptjs** for password hashing (Note: Currently partially broken, see [18-edge-cases.md](./18-edge-cases.md)).

### Frontend
- **React 18** with **Vite**.
- **TypeScript**.
- **Tailwind CSS** for styling and UI layouts.
- **React Query** (`@tanstack/react-query`) for data fetching, caching, and state management.
- **React Router DOM** for routing.
- **Zod** + **React Hook Form** for form validation.

## Architecture Pattern
The backend uses a layered architecture:
- `Routes` -> `Middlewares` -> `Controllers` -> `Services` -> `Models`.
The frontend separates API calls into distinct files per domain (e.g., `clientWallet.api.ts`, `clientWallet.query.ts`).

## References
- See [03-folder-structure.md](./03-folder-structure.md) for module organization.
- See [04-database.md](./04-database.md) for schema relationships.
