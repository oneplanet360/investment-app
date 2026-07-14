# 03 - Folder Structure

## Backend (`/backend-node`)
```
src/
├── configs/          # Environment variables and DB connection
├── constants/        # Error messages, HTTP status codes, Enums
├── controllers/      # Route handlers processing Req/Res
├── database/         # Mongoose models and schema definitions
├── middlewares/      # Auth guards, role checks, global error handling
├── routes/           # Express route definitions
├── seeders/          # DB init scripts (creates default admin)
├── services/         # Core business logic
├── types/            # TypeScript interfaces
├── utils/            # Async wrappers, error formatters, ID generators
└── validations/      # Zod validation schemas
```

## Frontend (`/frontend-react`)
```
src/
├── components/       # Reusable UI components (admin, client, common, tables)
├── lib/              # Utilities and static mock data files
├── pages/            # Page components grouped by route
│   ├── admin/        # Admin panel views
│   └── client/       # Shared, Agent, and Investor views
├── services/         # API integration layer
│   ├── admin/        # Admin API calls and React Query hooks
│   └── client/       # Client API calls and React Query hooks
├── types/            # TypeScript interfaces
└── App.tsx           # Main router config and route guards
```
