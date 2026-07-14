# 20 - Developer Guide

## Starting the Project

### Environment Variables
You must configure the `.env` file in `/backend-node`. The critical variables are:
- `MONGO_URI`
- `ACCESS_TOKEN_SECRET`
- `NODE_ENV`

### Database Seeding
To initialize the database and create the first Admin user, run:
```bash
npm run seed
```
**Warning:** The seeder creates the admin with a plain-text password (`admin123`).

### Running Locally
**Backend:**
```bash
cd backend-node
npm run dev
```

**Frontend:**
```bash
cd frontend-react
npm run dev
```

## Adding New Features
1. **Backend:** Create your model, add business logic to a new `service`, map it to a `controller`, and register the `route`.
2. **Frontend:** Create the raw API call in `/services/*/*.api.ts`, wrap it in a React Query hook in `*.query.ts` or `*.mutation.ts`, and consume the hook in your component.
