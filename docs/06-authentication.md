# 06 - Authentication

Authentication is handled via JWT and HTTP-only cookies.

## Flow
1. User submits credentials to `/auth/client/sign-in` or `/auth/admin/sign-in`.
2. Backend checks password. **[CRITICAL FLAW]**: Passwords are compared in plain text using `!==`.
3. If successful, backend signs a JWT with user `_id` and `role`.
4. JWT is set in an HTTP-only cookie (`clientAccessToken` or `adminAccessToken`).
5. Future requests include the cookie automatically.
6. The `auth.middleware.ts` decodes the cookie and attaches `req.user`.

## Impersonation
Admins can impersonate agents via `POST /api/v1/agents/:username/impersonate`. The backend returns a new token and overwrites the `clientAccessToken` cookie on the admin's browser, effectively logging them into the client portal.

## References
- See [14-security.md](./14-security.md) for details on the plain text password vulnerability.
