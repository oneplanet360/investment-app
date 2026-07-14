# Repository Analysis — Investment App

---

## 1. High-Level Architecture

```
investment-app/
├── backend-node/   → REST API (Node.js + Express + TypeScript + MongoDB)
└── frontend-react/ → SPA (React 19 + Vite + TypeScript + Tailwind CSS v4)
```

**Pattern**: Monorepo with two isolated apps (no shared package). Frontends communicate via HTTP REST over Axios. Auth uses **HTTP-only cookie JWTs** (separate cookies for admin and client). A single React SPA serves **three portals** (Admin, Agent, Investor) under one router tree, role-gated by route guards.

---

## 2. Folder Tree

```
investment-app/
├── project_context.md
├── backend-node/
│   ├── .env.example
│   ├── package.json           (pnpm, Express 5, Mongoose 9, Zod 4)
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts           (server bootstrap + DB connect)
│       ├── app.ts             (Express app, middleware mount, route mount)
│       ├── express.d.ts       (type augmentation: req.admin, req.user)
│       ├── configs/
│       │   ├── app.config.ts  (Zod env validation)
│       │   ├── cors.config.ts
│       │   ├── mongo.config.ts
│       │   └── index.ts
│       ├── constants/
│       │   ├── enum/          (6 enum/message files)
│       │   └── index.ts
│       ├── middlewares/
│       │   ├── auth.middleware.ts   (adminAuthMiddleware, clientAuthMiddleware)
│       │   ├── error.middleware.ts  (global error handler)
│       │   └── index.ts
│       ├── controllers/
│       │   ├── auth/
│       │   │   └── auth.controller.ts
│       │   ├── settings/
│       │   │   └── adminSettings.controller.ts
│       │   ├── adminAgents.controller.ts
│       │   ├── adminCommissions.controller.ts
│       │   ├── adminDashboard.controller.ts
│       │   ├── adminDeposits.controller.ts
│       │   ├── adminInvestments.controller.ts
│       │   ├── adminInvestors.controller.ts
│       │   ├── adminKyc.controller.ts
│       │   ├── adminProfile.controller.ts
│       │   ├── adminReports.controller.ts
│       │   ├── adminRoi.controller.ts
│       │   ├── adminWithdrawals.controller.ts
│       │   ├── clientAgent.controller.ts
│       │   ├── clientInvestments.controller.ts
│       │   ├── clientKyc.controller.ts
│       │   ├── clientNotifications.controller.ts
│       │   ├── clientProfile.controller.ts
│       │   ├── clientWallet.controller.ts
│       │   └── clientWithdrawal.controller.ts
│       ├── routes/
│       │   ├── index.ts
│       │   ├── auth.route.ts
│       │   ├── adminSettings.route.ts
│       │   ├── adminProfile.route.ts
│       │   ├── adminAgents.route.ts
│       │   ├── adminKyc.route.ts
│       │   ├── adminInvestors.route.ts
│       │   ├── adminDeposits.route.ts
│       │   ├── adminInvestments.route.ts
│       │   ├── adminWithdrawals.route.ts
│       │   ├── adminRoi.route.ts
│       │   ├── adminCommissions.route.ts
│       │   ├── adminReports.route.ts
│       │   ├── adminDashboard.route.ts
│       │   ├── clientProfile.route.ts
│       │   ├── clientWallet.route.ts
│       │   ├── clientWithdrawal.route.ts
│       │   ├── clientAgent.route.ts
│       │   ├── clientNotifications.route.ts
│       │   ├── clientKyc.route.ts
│       │   └── clientInvestments.route.ts
│       ├── services/          (15 service files, business logic layer)
│       ├── utils/
│       │   ├── custom.asyncWrapper.ts
│       │   ├── custom.error.ts
│       │   ├── custom.logger.ts   (winston)
│       │   ├── custom.response.ts
│       │   └── index.ts
│       ├── validations/
│       │   └── auth.schema.ts     (Zod schemas)
│       └── database/
│           ├── models/        (11 Mongoose models)
│           └── seeders/
│               └── index.ts   (seeds default Admin account)
│
└── frontend-react/
    ├── index.html
    ├── vite.config.ts
    ├── netlify.toml           (Netlify deploy config)
    ├── package.json
    └── src/
        ├── main.tsx           (React root, providers wrap)
        ├── App.tsx            (renders <AppRoutes />)
        ├── index.css          (Tailwind v4 base)
        ├── assets/
        ├── context/           (2 auth provider files — mirrored in /providers)
        ├── providers/
        │   ├── auth.provider.tsx         (Admin auth context)
        │   └── client-auth.provider.tsx  (Client auth context)
        ├── hooks/
        │   ├── useAuth.tsx        (Admin auth hook)
        │   └── useClientAuth.tsx  (Client auth hook)
        ├── lib/
        │   ├── axios.ts       (Axios instance + interceptor)
        │   ├── constant.tsx   (Admin sidebar menu definition)
        │   ├── data.ts        (Large static data file ~91 KB)
        │   ├── helper.ts
        │   └── utils.ts
        ├── types/
        │   └── index.ts       (All shared TS interfaces)
        ├── layout/
        │   ├── admin-layout.tsx
        │   ├── agent-layout.tsx
        │   └── investor-layout.tsx
        ├── routes/
        │   ├── index.tsx              (BrowserRouter + route tree)
        │   ├── common/
        │   │   ├── routePaths.tsx     (lazy-loaded page map)
        │   │   └── routes.ts          (route path constants)
        │   └── guard/
        │       ├── protected.route.tsx        (Admin auth guard)
        │       ├── public.route.tsx           (Admin public guard)
        │       ├── client-protected.route.tsx (role-aware client guard)
        │       └── client-public.route.tsx    (client public guard)
        ├── pages/
        │   ├── page-not-found.tsx
        │   ├── admin/
        │   │   ├── auth/signin-page.tsx
        │   │   ├── dashboard.tsx
        │   │   ├── profile.tsx
        │   │   ├── password.tsx
        │   │   ├── subscribers.tsx
        │   │   ├── investment-report.tsx
        │   │   ├── admin-settings.tsx
        │   │   ├── client-settings.tsx
        │   │   ├── investment-settings.tsx
        │   │   ├── agent-management/
        │   │   ├── investors-management/
        │   │   ├── investments/
        │   │   ├── topups/
        │   │   ├── deposits/
        │   │   ├── withdrawals/
        │   │   ├── kyc/
        │   │   ├── roi/
        │   │   ├── commissions/
        │   │   └── reports/
        │   └── client/
        │       ├── auth/signin-page.tsx
        │       ├── agent/         (8 pages)
        │       ├── investor/      (6 pages)
        │       └── shared/        (5 pages)
        ├── components/
        │   ├── admin/             (10 components)
        │   ├── client/            (2 layout components)
        │   ├── common/            (10 shared components)
        │   └── tables/
        │       └── investors-table.tsx
        └── services/
            ├── admin/             (13 API service dirs)
            └── client/            (8 API service dirs)
```

---

## 3. Major Modules

| Module | Layer | Purpose |
|---|---|---|
| **Auth** | Backend + Frontend | JWT cookie auth for Admin and Client (separate flows) |
| **Admin Dashboard** | Both | Platform-wide stats aggregation |
| **Agent Management** | Both | CRUD agents, ban, impersonate, reset password, notify |
| **Investor Management** | Both | List/view investors, reset password |
| **KYC** | Both | Document upload, status review (Pending/Approved/Rejected) |
| **Investments** | Both | Create, top-up, close-request, close, view by status |
| **Top-ups** | Both | Separate view of TOP_UP type investments |
| **Deposits** | Both | Admin-side deposit approval workflow |
| **Withdrawals** | Both | Investor and Agent withdrawal approval flows |
| **ROI** | Both | Monthly ROI credit log, admin viewer |
| **Commissions** | Both | Level-based commission tracking and log |
| **Reports** | Both | Investment, ROI, Commission, Withdrawal summary reports |
| **Notifications** | Both | Per-user notification feed |
| **System Settings** | Both | Investment settings (ROI %, min amount, commission levels) |
| **Admin Settings** | Both | Branding: app name, logo, colors, font |
| **Client Settings** | Frontend | Client-side setting view (stub) |
| **Wallet** | Both | Agent commission wallet + Investor ROI wallet |
| **Profile** | Both | Profile editing for Admin and Client users |
| **Agent Tree** | Both | Hierarchical downline tree visualization |

---

## 4. User Roles

| Role | Scope | Notes |
|---|---|---|
| **Admin** | Separate auth (Admin collection) | Single super-admin; manages entire platform |
| **Agent** | `User` collection, `role: AGENT` | Created only by Admin; has `sponsor`, `level`, `commissionBalance` |
| **Investor** | `User` collection, `role: INVESTOR` | Onboarded by Agent; has `referredBy`, `investmentBalance`, `roiBalance` |

Auth uses **discriminator pattern** in Mongoose: `User` is the base, `Agent` and `Investor` are discriminators sharing the `users` collection.

---

## 5. API Endpoints

### Auth — `/api/v1/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/admin/sign-in` | Public | Admin login |
| POST | `/admin/sign-out` | Public | Admin logout |
| GET | `/admin/verify` | Admin | Verify admin session |
| POST | `/client/sign-in` | Public | Client login |
| POST | `/client/sign-out` | Public | Client logout |
| GET | `/client/verify` | Client | Verify client session |

### Admin Settings — `/api/v1/admin-settings`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET/PUT | `/` | Admin | Get/update system-wide settings |

### Admin Profile — `/api/v1/admin/profile`
| Method | Path | Description |
|---|---|---|
| GET/PUT | `/` | Admin profile CRUD |
| PUT | `/password` | Admin password change |

### Agents — `/api/v1/agents`
| Method | Path | Description |
|---|---|---|
| POST | `/` | Create agent |
| GET | `/` | List agents |
| GET | `/:username` | Agent detail |
| PUT | `/:username/ban` | Toggle ban |
| POST | `/:username/notification` | Send notification |
| POST | `/:username/impersonate` | Impersonate agent (login-as) |
| PUT | `/:id/password-reset` | Reset agent password |

### KYC — `/api/v1/kyc`
| Method | Path | Description |
|---|---|---|
| GET | `/` | List all KYC records |
| GET | `/:id` | KYC detail |
| PATCH | `/:id/status` | Approve/reject KYC |

### Investors — `/api/v1/investors`
| Method | Path | Description |
|---|---|---|
| GET | `/` | List investors |
| GET | `/:username` | Investor detail |
| PUT | `/:id/password-reset` | Reset investor password |

### Admin Deposits — `/api/v1/admin/deposits`
| Method | Path | Description |
|---|---|---|
| GET | `/` | List deposits (filterable) |
| GET | `/:trxId` | Deposit detail |
| PATCH | `/:trxId/status` | Update deposit status |

### Admin Investments — `/api/v1/admin/investments`
| Method | Path | Description |
|---|---|---|
| GET | `/` | List investments |
| GET | `/:trxId` | Investment detail |
| PATCH | `/:trxId/status` | Update investment status |

### Admin Withdrawals — `/api/v1/admin/withdrawals`
| Method | Path | Description |
|---|---|---|
| GET | `/` | List withdrawals |
| GET | `/:trxId` | Withdrawal detail |
| PATCH | `/:trxId/status` | Approve/reject withdrawal |

### ROI — `/api/v1/admin/roi`
| Method | Path | Description |
|---|---|---|
| GET | `/` | ROI log list |

### Commissions — `/api/v1/admin/commissions`
| Method | Path | Description |
|---|---|---|
| GET | `/` | Commission log list |

### Admin Reports — `/api/v1/admin/reports`
| Method | Path | Description |
|---|---|---|
| GET | `/investments` | Investment report |
| GET | `/roi` | ROI report |
| GET | `/commissions` | Commissions report |
| GET | `/withdrawals` | Withdrawals report |

### Admin Dashboard — `/api/v1/admin/dashboard`
| Method | Path | Description |
|---|---|---|
| GET | `/` | Aggregated stats |

### Client Profile — `/api/v1/client/profile`
| Method | Path | Description |
|---|---|---|
| GET/PUT | `/` | Client profile |
| PUT | `/password` | Client password change |

### Client Wallet — `/api/v1/client/wallet`
| Method | Path | Description |
|---|---|---|
| GET | `/` | Wallet balance + transactions |

### Client Withdrawals — `/api/v1/client/withdrawals`
| Method | Path | Description |
|---|---|---|
| POST | `/` | Request withdrawal |
| GET | `/` | Withdrawal history |

### Client Agent — `/api/v1/client/agent`
| Method | Path | Description |
|---|---|---|
| POST | `/assign-investor` | Assign investor to agent |
| GET | `/investors` | Agent's investor list |
| POST | `/assign-sub-agent` | Assign sub-agent |
| GET | `/tree` | Downline tree |
| GET | `/search-user` | Search unassigned users |

### Client Notifications — `/api/v1/client/notifications`
| Method | Path | Description |
|---|---|---|
| GET | `/` | Get notifications |
| PATCH | `/:id/read` | Mark as read |

### Client KYC — `/api/v1/client/kyc`
| Method | Path | Description |
|---|---|---|
| POST | `/` | Submit KYC documents |
| GET | `/` | Get own KYC status |

### Client Investments — `/api/v1/client/investments`
| Method | Path | Description |
|---|---|---|
| GET | `/` | Investor's investment list |
| POST | `/` | Create investment / top-up |

---

## 6. Database Collections (MongoDB)

| Collection | Model File | Key Fields |
|---|---|---|
| `admins` | `admin.model.ts` | name, email, password, avatarUrl, isActive |
| `users` | `user.model.ts` | name, username, email, role (discriminatorKey), isActive, kycStatus, walletBalance |
| ↳ Agent discriminator | same file | sponsor, level, downlineCount, commissionBalance |
| ↳ Investor discriminator | same file | referredBy, investmentBalance, roiBalance |
| `investments` | `investment.model.ts` | userId, trxId, amount, type (INITIAL/TOP_UP), status, roiCycleStartDate, nextRoiDate |
| `deposits` | `deposit.model.ts` | userId, trxId, gateway, amount, charge, conversionRate, status |
| `withdrawals` | `withdrawal.model.ts` | userId, trxId, amount, gateway, type (COMMISSION/ROI_WALLET), status, adminRemarks |
| `commissions` | `commission.model.ts` | agentId, investorId, investmentId, level, rate, amount, status |
| `rois` | `roi.model.ts` | investorId, investmentId, amount, roiRate, monthIndex, status |
| `kycs` | `kyc.model.ts` | userId, documentType, documentNumber, documentFrontUrl, documentBackUrl, status |
| `notifications` | `notification.model.ts` | userId, title, message, isRead |
| `settings` | `setting.model.ts` | monthlyRoiPercentage, minInvestmentAmount, commissionLevels[] |
| `adminsettings` | `admin-setting.model.ts` | appName, frontendUrl, logoUrl, faviconUrl, primaryColor, backgroundColor, sidebarColor, fontFamily |

---

## 7. Pages / Screens

### Admin Portal

| Screen | Path |
|---|---|
| Sign In | `/admin/sign-in` |
| Dashboard | `/admin/dashboard` |
| Profile | `/admin/profile` |
| Change Password | `/admin/password` |
| All Investments | `/admin/investments` |
| Active Investments | `/admin/investments/active` |
| Completed Investments | `/admin/investments/completed` |
| Closed Investments | `/admin/investments/closed` |
| Close Requests | `/admin/investments/close-requests` |
| Investment Detail | `/admin/investments/:trxId` |
| All Top-ups | `/admin/topups` |
| Top-up Detail | `/admin/topups/:trxId` |
| All Deposits | `/admin/deposits` |
| Pending / Approved / Successful / Rejected / Initiated Deposits | `/admin/deposits/*` |
| Deposit Detail | `/admin/deposits/:trxId` |
| All Withdrawals | `/admin/withdrawals` |
| Pending / Approved / Rejected Withdrawals | `/admin/withdrawals/*` |
| Withdrawal Detail | `/admin/withdrawals/:trxId` |
| Agent Withdrawals | `/admin/withdrawals/agent` |
| Agent Withdrawal Detail | `/admin/withdrawals/agent/:trxId` |
| ROI Log | `/admin/roi` |
| Commission Log | `/admin/commissions` |
| All KYC | `/admin/kyc` |
| Pending / Approved / Rejected KYC | `/admin/kyc/*` |
| KYC Detail | `/admin/kyc/:id` |
| All Agents | `/admin/agents` |
| Add Agent | `/admin/agents/add` |
| Agent Password Reset | `/admin/agents/password-reset` |
| Agent Detail | `/admin/agents/:username` |
| All Investors | `/admin/investors` |
| Investor Password Reset | `/admin/investors/password-reset` |
| Investor Detail | `/admin/investors/:username` |
| Subscribers | `/admin/subscribers` |
| Investment Report | `/admin/investment-report` |
| Reports: Investments | `/admin/reports/investments` |
| Reports: ROI | `/admin/reports/roi` |
| Reports: Commissions | `/admin/reports/commissions` |
| Reports: Withdrawals | `/admin/reports/withdrawals` |
| Investment Settings | `/admin/settings/investment` |
| Admin Settings | `/admin/settings/admin` |
| Client Settings | `/admin/settings/client` |

### Agent Portal

| Screen | Path |
|---|---|
| Sign In | `/client/sign-in` |
| Dashboard | `/agent/dashboard` |
| All Investors | `/agent/investors` |
| Assign User | `/agent/assign-user` |
| Team | `/agent/team` |
| Agent Tree | `/agent/tree` |
| Commissions | `/agent/commissions` |
| Wallet | `/agent/wallet` |
| Withdrawals | `/agent/withdrawals` |
| Profile Setting | `/agent/profile` |
| Change Password | `/agent/change-password` |
| 2FA Security | `/agent/2fa-security` |
| Notifications | `/agent/notifications` |
| KYC | `/agent/kyc` |

### Investor Portal

| Screen | Path |
|---|---|
| Sign In | `/client/sign-in` (shared) |
| Dashboard | `/investor/dashboard` |
| Investments | `/investor/investments` |
| Top-ups | `/investor/top-ups` |
| ROI History | `/investor/roi-history` |
| Wallet | `/investor/wallet` |
| Withdrawals | `/investor/withdrawals` |
| Profile Setting | `/investor/profile` |
| Change Password | `/investor/change-password` |
| 2FA Security | `/investor/2fa-security` |
| Notifications | `/investor/notifications` |
| KYC | `/investor/kyc` |

---

## 8. Reusable Components

### Admin Components (`/components/admin/`)
| Component | Purpose |
|---|---|
| `sidebar.tsx` | Admin navigation sidebar |
| `topbar.tsx` | Admin top navigation bar |
| `pagination.tsx` | Pagination control |
| `details.tsx` | Shared detail panel for Agent/Investor |
| `agent-table.tsx` | Agent list table |
| `investment-table.tsx` | Investment list table |
| `deposit-table.tsx` | Deposit list table |
| `withdrawal-table.tsx` | Withdrawal list table |
| `kyc-table.tsx` | KYC list table |
| `command-paletter.tsx` | Command palette (search/navigation) |

### Common Components (`/components/common/`)
| Component | Purpose |
|---|---|
| `loading-spinner.tsx` | Loading state indicator |
| `error-fallback.tsx` | React Error Boundary fallback UI |
| `profile-setting.tsx` | Shared profile settings form |
| `change-password.tsx` | Password change form |
| `pagination.tsx` | Stub/placeholder pagination |
| `2fa-security.tsx` | 2FA placeholder |
| `deposit-table.tsx` | Stub table component |
| `investment-table.tsx` | Stub table component |
| `kyc-table.tsx` | Stub table component |
| `withdrawal-table.tsx` | Stub table component |

### Client Components (`/components/client/`)
| Component | Purpose |
|---|---|
| `sidebar.tsx` | Unified sidebar for Agent and Investor |
| `topbar.tsx` | Unified topbar for Agent and Investor |

### Tables (`/components/tables/`)
| Component | Purpose |
|---|---|
| `investors-table.tsx` | Investor list table (used in agent portal) |

---

## 9. Third-Party Integrations

| Library | Where | Purpose |
|---|---|---|
| **MongoDB / Mongoose** | Backend | Primary database |
| **JWT (jsonwebtoken)** | Backend | Cookie-based auth tokens |
| **bcryptjs** | Backend | Password hashing |
| **Zod** | Backend + Frontend | Runtime schema validation |
| **multer** | Backend | File uploads (KYC document images) |
| **helmet** | Backend | Security headers |
| **hpp** | Backend | HTTP parameter pollution protection |
| **compression** | Backend | Gzip compression |
| **cors** | Backend | CORS policy |
| **morgan** | Backend | HTTP request logging (dev only) |
| **winston** | Backend | Structured server logging |
| **axios** | Backend + Frontend | HTTP client |
| **TanStack Query (React Query)** | Frontend | Server state management + caching |
| **React Hook Form** | Frontend | Form state and validation |
| **React Router DOM v7** | Frontend | Client-side routing |
| **Tailwind CSS v4** | Frontend | Utility-first CSS |
| **Lucide React** | Frontend | Icon library |
| **Sonner** | Frontend | Toast notifications |
| **React Helmet Async** | Frontend | `<head>` meta tag management |
| **React Error Boundary** | Frontend | Component error catching |
| **Netlify** | Hosting | Frontend deployment (`netlify.toml`) |

> **No external payment gateway or email service is currently integrated** (deposit gateway is a free-text string field).

---

## 10. Potential Unfinished / Stub Modules

| Module | Evidence | Status |
|---|---|---|
| **2FA Security** | `2fa-security.tsx` is 113 bytes (stub), shared page is 2.3 KB but likely UI-only | ⚠️ Unimplemented |
| **Client Settings page** | `client-settings.tsx` is only 523 bytes | ⚠️ Stub |
| **Subscribers** | `subscribers.tsx` is 3.8 KB; no backend route or controller exists for email subscriptions | ⚠️ Frontend-only, no backend |
| **Investor Investments page** | `investor/investments.tsx` is only 110 bytes | ⚠️ Stub |
| **Investor ROI History page** | `roi-history.tsx` is only 109 bytes | ⚠️ Stub |
| **Investor Top-ups page** | `top-ups.tsx` is only 101 bytes | ⚠️ Stub |
| **Agent Commissions page** | `commissions.tsx` is only 110 bytes | ⚠️ Stub |
| **Agent Team page** | `team.tsx` is only 96 bytes | ⚠️ Stub |
| **Payment Gateway** | Deposit/withdrawal `gateway` is a plain string; no real payment processor connected | ⚠️ Not integrated |
| **Email Notifications** | No email service (SMTP/SendGrid) present in backend | ⚠️ Missing |
| **Admin Impersonation** | `impersonateAgentController` exists in backend; frontend UI unknown | ⚠️ Partial |
| **Common table stubs** | `common/deposit-table.tsx`, `kyc-table.tsx`, `withdrawal-table.tsx`, `investment-table.tsx`, `pagination.tsx` are all tiny stub files (<100 bytes) | ⚠️ Placeholder only |
| **`lib/data.ts`** | 91 KB static data file — likely mock/demo data still in use | ⚠️ Investigate |
| **Seeder password hashing** | `seeders/index.ts` creates the admin with a plain-text password — no bcrypt hashing applied | 🚨 Bug |
