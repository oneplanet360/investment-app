# 15 - Performance

## Backend
- **Database Aggregations:** Admin dashboards and reports use efficient MongoDB `$group` and `$match` pipelines, allowing the database engine to handle math rather than pulling entire collections into Node.js memory.
- **Missing Pagination:** Some client-facing queries (like `getClientWithdrawalsFn`) return all documents sorted by date, lacking pagination. If an investor uses the system for years, this payload will grow infinitely.

## Frontend
- **Debouncing:** Search inputs (e.g., in `all-agents.tsx`) correctly use a 300ms debounce before firing API queries, preventing spam requests.
- **React Query:** Caching prevents redundant network requests when navigating between pages.

## Database Optimization
- **Missing Indexes:** Currently, the models lack explicit indexing on highly queried fields like `trxId`, `userId`, or `status`. As the tables grow, these queries will become slow full-collection scans.
