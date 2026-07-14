# 05 - API

The Express.js REST API is versioned at `/api/v1/`.

## Main Namespaces

### Authentication (`/auth`)
- `/admin/sign-in`, `/client/sign-in`: Authenticate and issue HTTP-only cookies.
- `/admin/verify`, `/client/verify`: Fetch current session data.

### Admin (`/admin`, `/agents`, `/investors`, `/kyc`)
- Full CRUD for agent and investor management.
- Aggregation endpoints for dashboard (`/admin/dashboard`) and reports (`/admin/reports/*`).
- Financial approvals for deposits, withdrawals, and investments (`PATCH /:id/status`).

### Client (`/client`)
- Shared routes: `/profile`, `/kyc`, `/notifications`, `/withdrawals`.
- Agent specific: `/agent/investors`, `/agent/search-user`, `/agent/assign-sub-agent`, `/agent/tree`.
- Investor specific: `/investments`, `/wallet`.

## Standards
- All responses use standard formatting: `{ success: boolean, message?: string, data?: any }` for objects, or `{ success: boolean, data: any[], meta: { pagination } }` for lists.
- Errors are caught by `globalErrorHandler` and returned uniformly.
