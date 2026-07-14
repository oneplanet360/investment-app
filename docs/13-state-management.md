# 13 - State Management

## Server State
The frontend uses **React Query (`@tanstack/react-query`)** exclusively for all server-side state.
- **Queries:** Separated into `.query.ts` files (e.g., `useAgentsQuery`). Handled with automatic caching and refetching.
- **Mutations:** Separated into `.mutation.ts` files for POST/PUT/PATCH operations.
- **API Calls:** Raw Axios calls are abstracted into `.api.ts` files, providing type safety before reaching React Query.

## Client State
- **React Context / Zustand:** The codebase relies primarily on local component state (`useState`) and React Query's cache. There is no large-scale global client state manager (like Redux or Zustand) implemented.
- **Forms:** Handled via `react-hook-form` to isolate form state and validation logic.
