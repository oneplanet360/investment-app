# Feature Discovery — Investment Platform

**Status Legend**
- ✅ Implemented — full backend + frontend wired together with real data
- 🟡 Partial — backend exists but frontend is missing, or vice versa; or logic gaps
- 🔴 Not Implemented — feature is described in spec / referenced but zero code exists
- ⚪ Placeholder — route exists and renders, but content is a static text stub only
- ❓ Unknown — cannot be determined from current codebase alone

---

## Feature 1 — Admin Sign In

**Purpose:** Authenticates the admin user and issues an HTTP-only cookie JWT.

**User Roles:** Admin

**Frontend Pages:** `/admin/sign-in` → `pages/admin/auth/signin-page.tsx` (6,884 bytes — full form)

**Backend APIs:**
- `POST /api/v1/auth/admin/sign-in`
- `POST /api/v1/auth/admin/sign-out`
- `GET /api/v1/auth/admin/verify`

**Database Models:** `admins`

**Status: 🟡 Partial**

**Evidence:**
- Full signin UI exists (`signin-page.tsx` 6,884 bytes, uses real API call via `clientAuth.api.ts`).
- Backend `signInAdminServices` found in `auth.service.ts`.
- **Critical bug:** `auth.service.ts` line 21 compares password with plain text: `existingAdmin.password !== password` — **no bcrypt comparison**. Passwords are stored and compared as plain text.
- The seeder also creates the admin with a plain-text password (no hashing).

---

## Feature 2 — Client Sign In (Agent & Investor)

**Purpose:** Authenticates agents and investors with a shared login page; issues a separate HTTP-only cookie (`clientAccessToken`).

**User Roles:** Agent, Investor

**Frontend Pages:** `/client/sign-in` → `pages/client/auth/signin-page.tsx` (4,522 bytes — full form)

**Backend APIs:**
- `POST /api/v1/auth/client/sign-in`
- `POST /api/v1/auth/client/sign-out`
- `GET /api/v1/auth/client/verify`

**Database Models:** `users`

**Status: 🟡 Partial**

**Evidence:**
- Full signin UI exists and wired to the API.
- Backend `signInClientServices` in `auth.service.ts`.
- **Critical bug:** Line 57 of `auth.service.ts`: `existingUser.password !== password` — **plain-text password comparison, no bcrypt**. Client password change (`clientProfile.controller.ts`) correctly uses bcrypt, creating an inconsistency — passwords changed via the profile would be hashed but compared as plain text at login.
- Route guard (`client-protected.route.tsx`) enforces role-based access per login.

---

## Feature 3 — Admin Dashboard

**Purpose:** Displays platform-wide aggregated statistics (total members, investments, ROI paid, deposits, withdrawals) and a recent transactions feed.

**User Roles:** Admin

**Frontend Pages:** `/admin/dashboard` → `pages/admin/dashboard.tsx` (9,240 bytes — full UI)

**Backend APIs:** `GET /api/v1/admin/dashboard`

**Database Models:** `users`, `investments`, `deposits`, `withdrawals`, `rois`

**Status: ✅ Implemented**

**Evidence:**
- `dashboard.tsx` imports and calls `useAdminDashboard` query hook.
- Service `adminDashboard.service.ts` (4,384 bytes) aggregates all stats with MongoDB pipelines.
- All stat categories (members, investments, ROI, deposits, withdrawals, recent transactions) are computed and returned.

---

## Feature 4 — Agent Management (Admin)

**Purpose:** Admin creates, lists, views, bans/unbans, resets passwords for, sends notifications to, and impersonates agents.

**User Roles:** Admin

**Frontend Pages:**
- `/admin/agents` → `pages/admin/agent-management/all-agents.tsx` — real data via `useAgentsQuery`
- `/admin/agents/add` → `pages/admin/agent-management/add-agent.tsx` (7,997 bytes — full form)
- `/admin/agents/password-reset` → `pages/admin/agent-management/agent-password-reset.tsx` (7,165 bytes — full form)
- `/admin/agents/:username` → `components/admin/details.tsx` (21,188 bytes — full detail view)

**Backend APIs:**
- `POST /api/v1/agents` — create agent
- `GET /api/v1/agents` — list agents
- `GET /api/v1/agents/:username` — agent detail
- `PUT /api/v1/agents/:username/ban` — toggle ban
- `POST /api/v1/agents/:username/notification` — send notification
- `POST /api/v1/agents/:username/impersonate` — impersonate
- `PUT /api/v1/agents/:id/password-reset` — reset password

**Database Models:** `users` (AGENT discriminator), `notifications`

**Status: ✅ Implemented**

**Evidence:**
- All 7 API routes exist in `adminAgents.route.ts` and all controller functions are implemented.
- `adminAgents.service.ts` and `adminUsers.service.ts` provide the service layer.
- Frontend pages use React Query and show real API data (`all-agents.tsx` uses `useAgentsQuery`).
- Impersonation sets `clientAccessToken` cookie in the response.

---

## Feature 5 — Investor Management (Admin)

**Purpose:** Admin lists, views, and resets passwords for investors.

**User Roles:** Admin

**Frontend Pages:**
- `/admin/investors` → `pages/admin/investors-management/all-investors.tsx` — real data via `useInvestorsQuery`
- `/admin/investors/password-reset` → `pages/admin/investors-management/investor-password-reset.tsx` (7,237 bytes)
- `/admin/investors/:username` → `components/admin/details.tsx` — shared detail component

**Backend APIs:**
- `GET /api/v1/investors`
- `GET /api/v1/investors/:username`
- `PUT /api/v1/investors/:id/password-reset`

**Database Models:** `users` (INVESTOR discriminator), `investments`, `deposits`, `withdrawals`

**Status: ✅ Implemented**

**Evidence:**
- `adminInvestors.route.ts`, `adminInvestors.controller.ts`, `adminInvestors.service.ts` all exist.
- Frontend uses `useInvestorsQuery` with real API.
- Detail view (`details.tsx`, 21,188 bytes) is shared between Agent and Investor detail.
- Admin cannot ban investors via UI — the ban route only handles `AGENT` role in the current controller.

---

## Feature 6 — KYC Management (Admin)

**Purpose:** Admin reviews identity documents submitted by agents and investors, then approves or rejects them.

**User Roles:** Admin

**Frontend Pages:**
- `/admin/kyc` → `pages/admin/kyc/all.tsx` — real data via `useKycSubmissionsQuery`
- `/admin/kyc/pending`, `/admin/kyc/approved`, `/admin/kyc/rejected` — filtered views (1,131–1,134 bytes each, wired to same query with status filter)
- `/admin/kyc/:id` → `pages/admin/kyc/detail.tsx` (9,413 bytes — full detail with approve/reject actions)

**Backend APIs:**
- `GET /api/v1/kyc`
- `GET /api/v1/kyc/:id`
- `PATCH /api/v1/kyc/:id/status`

**Database Models:** `kycs`, `users`

**Status: ✅ Implemented**

**Evidence:**
- All routes, controllers, and service in `adminKyc.*` files are fully coded.
- `updateKycStatusService` updates both `Kyc` record and the `User.kycStatus` field synchronously.
- Admin KYC `detail.tsx` (9,413 bytes) renders document images and action buttons.
- `adminKyc.mutation.ts` exists for approve/reject actions.

---

## Feature 7 — Investment Management (Admin)

**Purpose:** Admin views all investments by status, views investment detail, and can change investment status (including approving close requests).

**User Roles:** Admin

**Frontend Pages:**
- `/admin/investments` — all (uses `useAdminInvestments` query, real data)
- `/admin/investments/active`, `/completed`, `/closed`, `/close-requests` — filtered views (~875–916 bytes each, all wired to the same table component)
- `/admin/investments/:trxId` → `pages/admin/investments/detail.tsx` (14,203 bytes — full detail)

**Backend APIs:**
- `GET /api/v1/admin/investments`
- `GET /api/v1/admin/investments/:trxId`
- `PATCH /api/v1/admin/investments/:trxId/status`

**Database Models:** `investments`, `users`

**Status: ✅ Implemented**

**Evidence:**
- Full service `adminInvestments.service.ts` (2,704 bytes) with pagination, search, status filter.
- Close approval logic: when status changes to CLOSED, `amount + totalReturn` is credited to the investor's wallet.
- Frontend uses `useAdminInvestments` React Query hook with real data.

---

## Feature 8 — Top-ups Management (Admin)

**Purpose:** Admin views all top-up type investments and their details.

**User Roles:** Admin

**Frontend Pages:**
- `/admin/topups` → `pages/admin/topups/all.tsx` (7,353 bytes — full table UI)
- `/admin/topups/:trxId` → `pages/admin/topups/detail.tsx` (3,112 bytes)

**Backend APIs:** None dedicated — top-ups are `Investment` records with `type: TOP_UP`; re-uses `GET /api/v1/admin/investments`

**Database Models:** `investments` (filtered by `type: TOP_UP`)

**Status: 🟡 Partial**

**Evidence:**
- `topups/all.tsx` is fully built UI but imports from `../../lib/data` (static mock data), not a live API call.
- `topups/detail.tsx` (3,112 bytes) also uses `lib/data`.
- No dedicated API endpoint for top-ups exists. The backend investment list does support filtering.
- Frontend is disconnected from the real backend for this section.

---

## Feature 9 — Deposit Management (Admin)

**Purpose:** Admin views deposits by status and approves/rejects them. When marked successful, the investor's wallet is credited.

**User Roles:** Admin

**Frontend Pages:**
- `/admin/deposits` — all (real data via `useAdminDeposits`)
- `/admin/deposits/pending`, `/approved`, `/successful`, `/rejected`, `/initiated` — filtered views (~848–887 bytes each, all wired to real query)
- `/admin/deposits/:trxId` → `pages/admin/deposits/detail.tsx` (6,917 bytes — full detail)

**Backend APIs:**
- `GET /api/v1/admin/deposits`
- `GET /api/v1/admin/deposits/:trxId`
- `PATCH /api/v1/admin/deposits/:trxId/status`

**Database Models:** `deposits`, `users`

**Status: ✅ Implemented**

**Evidence:**
- `adminDeposits.service.ts` (2,444 bytes) handles listing, detail, and status update.
- Status update to `SUCCESSFUL` triggers wallet credit: `user.walletBalance += deposit.convertedAmount`.
- Frontend uses `useAdminDeposits` React Query hook; deposit list and detail pages are fully built.
- `adminDeposits.mutation.ts` handles the status change action.

---

## Feature 10 — Withdrawal Management (Admin) — Investor Withdrawals

**Purpose:** Admin views and approves/rejects investor withdrawal requests. Rejected withdrawals refund the balance.

**User Roles:** Admin

**Frontend Pages:**
- `/admin/withdrawals` — all (real data via `useAdminWithdrawals`)
- `/admin/withdrawals/pending`, `/approved`, `/rejected` — filtered views (wired to real query)
- `/admin/withdrawals/:trxId` → `pages/admin/withdrawals/detail.tsx` (6,740 bytes)

**Backend APIs:**
- `GET /api/v1/admin/withdrawals`
- `GET /api/v1/admin/withdrawals/:trxId`
- `PATCH /api/v1/admin/withdrawals/:trxId/status`

**Database Models:** `withdrawals`, `users`

**Status: ✅ Implemented**

**Evidence:**
- `adminWithdrawals.service.ts` (2,499 bytes) — rejection refunds wallet balance.
- Frontend pages use `useAdminWithdrawals`; detail page is full-featured.
- `adminWithdrawals.mutation.ts` handles status update.

---

## Feature 11 — Withdrawal Management (Admin) — Agent Withdrawals

**Purpose:** Admin views and processes agent commission withdrawal requests separately from investor withdrawals.

**User Roles:** Admin

**Frontend Pages:**
- `/admin/withdrawals/agent` → `pages/admin/withdrawals/agent.tsx` (929 bytes)
- `/admin/withdrawals/agent/:trxId` → `pages/admin/withdrawals/agent-detail.tsx` (6,502 bytes)

**Backend APIs:** Re-uses `GET /api/v1/admin/withdrawals?type=COMMISSION`

**Database Models:** `withdrawals`

**Status: 🟡 Partial**

**Evidence:**
- `agent.tsx` (929 bytes) calls `useAdminWithdrawals` with a `type=COMMISSION` filter — real API, correct approach.
- `agent-detail.tsx` (6,502 bytes) is a full detail page.
- No dedicated API route for agent withdrawals — uses the same endpoint with type filter, which is correct.
- The status is Partial because the agent withdrawal list page is minimal in size; visual fidelity unknown without running.

---

## Feature 12 — ROI Log (Admin)

**Purpose:** Admin views a paginated log of all ROI credits issued, with summary stats (total paid, credited count).

**User Roles:** Admin

**Frontend Pages:** `/admin/roi` → `pages/admin/roi/index.tsx` (7,024 bytes — full UI)

**Backend APIs:** `GET /api/v1/admin/roi`

**Database Models:** `rois`, `users`, `investments`

**Status: ✅ Implemented**

**Evidence:**
- `adminRoi.service.ts` (1,797 bytes) paginates ROI records with stats.
- `adminRoi.query.ts` and `adminRoi.api.ts` exist in the frontend services.
- Page is 7,024 bytes — substantial implementation.

---

## Feature 13 — Commission Log (Admin)

**Purpose:** Admin views a paginated log of all commissions distributed, broken down by level.

**User Roles:** Admin

**Frontend Pages:** `/admin/commissions` → `pages/admin/commissions/index.tsx` (7,688 bytes — full UI)

**Backend APIs:** `GET /api/v1/admin/commissions`

**Database Models:** `commissions`, `users`, `investments`

**Status: ✅ Implemented**

**Evidence:**
- `adminCommissions.service.ts` (2,107 bytes) paginates with level filter and level-by-level totals.
- `adminCommissions.query.ts` and `adminCommissions.api.ts` exist.
- Page is 7,688 bytes.

---

## Feature 14 — Reports (Admin)

**Purpose:** Admin views four structured report pages: Investment Report, ROI Report, Commission Report, Withdrawals Report.

**User Roles:** Admin

**Frontend Pages:**
- `/admin/reports/investments` → `pages/admin/reports/investments.tsx` (7,197 bytes — real API)
- `/admin/reports/roi` → `pages/admin/reports/roi.tsx` (3,235 bytes — real API)
- `/admin/reports/commissions` → `pages/admin/reports/commissions.tsx` (4,408 bytes — real API)
- `/admin/reports/withdrawals` → `pages/admin/reports/withdrawals.tsx` (5,711 bytes — real API)

**Backend APIs:**
- `GET /api/v1/admin/reports/investments`
- `GET /api/v1/admin/reports/roi`
- `GET /api/v1/admin/reports/commissions`
- `GET /api/v1/admin/reports/withdrawals`

**Database Models:** `investments`, `rois`, `commissions`, `withdrawals`, `deposits`

**Status: ✅ Implemented**

**Evidence:**
- `adminReports.service.ts` (8,052 bytes — largest service file) aggregates top investors, level distributions, monthly ROI breakdowns, agent leaderboards.
- All 4 frontend pages import from `useAdminInvestmentReport`, `useAdminRoiReport`, etc. (real hooks).
- `adminReports.query.ts` (1,051 bytes) covers all 4 queries.

---

## Feature 15 — Investment Report (Legacy / Alternate)

**Purpose:** Displays a quick 4-stat summary card for investments. Appears to be an older or duplicate report page distinct from the reports section.

**User Roles:** Admin

**Frontend Pages:** `/admin/investment-report` → `pages/admin/investment-report.tsx` (2,203 bytes)

**Backend APIs:** None

**Database Models:** None directly called

**Status: 🟡 Partial**

**Evidence:**
- Page reads from `../../lib/data` (static mock data), not from the API.
- It renders 4 stat cards (total investments, total contributions, close requests, completed investments).
- Separate from the `/admin/reports/investments` page which uses real data.
- This page appears to be legacy or transitional.

---

## Feature 16 — Investment Settings (Admin)

**Purpose:** Admin configures the monthly ROI percentage, minimum investment amount, and commission levels per agent tier.

**User Roles:** Admin

**Frontend Pages:** `/admin/settings/investment` → `pages/admin/investment-settings.tsx` (10,076 bytes)

**Backend APIs:** `GET /api/v1/admin-settings`, `PUT /api/v1/admin-settings`

**Database Models:** `settings` (ROI/commission), `adminsettings` (branding)

**Status: 🟡 Partial**

**Evidence:**
- `investment-settings.tsx` imports from `../../lib/data` (`systemSettings`, `roiSettings`, `commissionSettings`) — **uses static mock data, not the real API**.
- `adminSettings.service.ts` only handles the `AdminSetting` (branding) model, not the `Setting` (ROI/commission) model.
- There is no backend route or controller for updating `Setting` (ROI %, min investment, commission levels).
- The `Setting` model exists with the correct schema but no API exposes it for the admin to modify.

---

## Feature 17 — Admin Branding / App Settings

**Purpose:** Admin updates the app name, logo URL, favicon URL, primary color, background color, sidebar color, and font family.

**User Roles:** Admin

**Frontend Pages:** `/admin/settings/admin` → `pages/admin/admin-settings.tsx` (14,539 bytes — full form with live preview)

**Backend APIs:**
- `GET /api/v1/admin-settings`
- `PUT /api/v1/admin-settings`

**Database Models:** `adminsettings`

**Status: ✅ Implemented**

**Evidence:**
- `admin-settings.tsx` uses `useAdminSettingsQuery` and `useAdminSettingsMutation` — real API calls.
- `adminSettings.service.ts` (636 bytes) has `getAdminSettingsService` and `updateAdminSettingsService`.
- Form validates with Zod, includes live color preview using `getContrastColor` utility.
- Backend creates default settings if none exist.

---

## Feature 18 — Client Settings (Admin)

**Purpose:** Admin manages client-facing application preferences.

**User Roles:** Admin

**Frontend Pages:** `/admin/settings/client` → `pages/admin/client-settings.tsx`

**Backend APIs:** None

**Database Models:** None

**Status: ⚪ Placeholder**

**Evidence:**
- `client-settings.tsx` (523 bytes) renders: `<p>Client settings coming soon...</p>`.
- No backend route, controller, service, or model exists for this.

---

## Feature 19 — Admin Profile Management

**Purpose:** Admin views and updates their own profile (name, email, avatar) and changes their password.

**User Roles:** Admin

**Frontend Pages:**
- `/admin/profile` → `pages/admin/profile.tsx` (8,955 bytes — full form)
- `/admin/password` → `pages/admin/password.tsx` (7,224 bytes — full form)

**Backend APIs:**
- `GET /api/v1/admin/profile`
- `PUT /api/v1/admin/profile`
- `PUT /api/v1/admin/profile/password`

**Database Models:** `admins`

**Status: ✅ Implemented**

**Evidence:**
- `adminProfile.service.ts` (2,200 bytes) handles get and update.
- `adminProfile.mutation.ts` and `adminProfile.query.ts` exist in frontend services.
- Both pages are substantial in size (8,955 and 7,224 bytes).

---

## Feature 20 — Subscribers (Admin)

**Purpose:** Admin views a list of email subscribers and can remove or email them.

**User Roles:** Admin

**Frontend Pages:** `/admin/subscribers` → `pages/admin/subscribers.tsx` (3,820 bytes)

**Backend APIs:** None

**Database Models:** None

**Status: 🟡 Partial**

**Evidence:**
- `subscribers.tsx` reads from `import { subscribers as initialSubscribers } from "../../lib/data"` — entirely static mock data.
- UI allows local removal (state-only, not persisted).
- "Send Email" button exists but is not wired to any action.
- No database model, no backend route, no email integration.

---

## Feature 21 — Agent Dashboard

**Purpose:** Displays the agent's key stats (balances, commissions, team size) and recent activity.

**User Roles:** Agent

**Frontend Pages:** `/agent/dashboard` → `pages/client/agent/dashboard.tsx` (10,236 bytes)

**Backend APIs:** None called directly — uses static dummy data

**Database Models:** N/A (not connected)

**Status: 🟡 Partial**

**Evidence:**
- `dashboard.tsx` line 12: `const [activeTab] = useState("dashboard")`.
- All values shown are hardcoded strings: `"$4,250.50"`, `"+5.2%"` etc.
- No API call is made for real wallet or commission data.
- The page is visually complete with charts and stat cards, but all data is fake.

---

## Feature 22 — Agent Investor List

**Purpose:** Agent views a list of all investors they have onboarded/manage.

**User Roles:** Agent

**Frontend Pages:** `/agent/investors` → `pages/client/agent/all-investors.tsx` (5,880 bytes)

**Backend APIs:** `GET /api/v1/client/agent/investors`

**Database Models:** `users` (INVESTOR discriminator)

**Status: ✅ Implemented**

**Evidence:**
- Page calls `getClientInvestorsFn()` directly (not React Query, uses direct axios call).
- Backend returns investors where `referredBy === currentAgentId`.
- Page displays investor cards with name, email, KYC status, phone, and location.

---

## Feature 23 — Assign User (Agent)

**Purpose:** Agent searches for unassigned users (sub-agents or investors depending on their level) and links them into their downline.

**User Roles:** Agent

**Frontend Pages:** `/agent/assign-user` → `pages/client/agent/assign-user.tsx` (6,292 bytes)

**Backend APIs:**
- `GET /api/v1/client/agent/search-user`
- `POST /api/v1/client/agent/assign-sub-agent`
- `POST /api/v1/client/agent/assign-investor`

**Database Models:** `users`

**Status: ✅ Implemented**

**Evidence:**
- Page reads `userLevel` from `useClientVerifyUser()` and dynamically sets `targetRole` to `INVESTOR` or `AGENT` based on level.
- Uses `useSearchUnassignedUser`, `useAssignClientSubAgent`, `useAssignClientInvestor` hooks.
- Backend enforces: Level 4 can assign investors; Levels 1–3 can assign sub-agents.
- Notifications are sent to admin on investor assignment.

---

## Feature 24 — Agent Downline Tree

**Purpose:** Agent visualizes their full downline hierarchy (sub-agents and investors) as an interactive tree.

**User Roles:** Agent

**Frontend Pages:** `/agent/tree` → `pages/client/agent/tree.tsx` (4,948 bytes)

**Backend APIs:** `GET /api/v1/client/agent/tree`

**Database Models:** `users`

**Status: ✅ Implemented**

**Evidence:**
- `tree.tsx` calls `useClientAgentTreeQuery()` — real API.
- Backend recursively traverses agent hierarchy up to 4 levels, returning sub-agents and their investors.
- `TreeNode` component renders each node with connecting lines and role-specific colors.

---

## Feature 25 — Agent Team Page

**Purpose:** Displays agent's team/downline overview (separate from tree view).

**User Roles:** Agent

**Frontend Pages:** `/agent/team` → `pages/client/agent/team.tsx`

**Backend APIs:** None

**Database Models:** None

**Status: ⚪ Placeholder**

**Evidence:**
- `team.tsx` (96 bytes): `return <div className="p-6 text-white text-xl">Team</div>;`
- 96 bytes — pure text stub.

---

## Feature 26 — Agent Commissions Page

**Purpose:** Agent views their commission history and earnings breakdown.

**User Roles:** Agent

**Frontend Pages:** `/agent/commissions` → `pages/client/agent/commissions.tsx`

**Backend APIs:** None — no dedicated client-side commission history endpoint exists

**Database Models:** `commissions`

**Status: ⚪ Placeholder**

**Evidence:**
- `commissions.tsx` (110 bytes): `return <div className="p-6 text-white text-xl">Commissions</div>;`
- No frontend service directory for client commissions exists.
- No backend route at `GET /api/v1/client/commissions` exists.

---

## Feature 27 — Agent Wallet

**Purpose:** Agent views their wallet balance, commission balance, and full transaction history.

**User Roles:** Agent

**Frontend Pages:** `/agent/wallet` → `pages/client/agent/wallet.tsx` (8,134 bytes)

**Backend APIs:**
- `GET /api/v1/client/wallet`
- `GET /api/v1/client/wallet/transactions`

**Database Models:** `users` (AGENT), `deposits`, `withdrawals`

**Status: ✅ Implemented**

**Evidence:**
- `wallet.tsx` calls `getClientWalletFn()` and `getClientWalletTransactionsFn()` from `clientWallet.api.ts`.
- Backend `getWalletController` returns `walletBalance`, `commissionBalance` (agent), and aggregated totals.
- Transaction ledger combines deposits and withdrawals sorted by date.

---

## Feature 28 — Agent Withdrawals

**Purpose:** Agent requests withdrawal of their commission balance and views past withdrawal requests.

**User Roles:** Agent

**Frontend Pages:** `/agent/withdrawals` → `pages/client/agent/withdrawals.tsx` (9,277 bytes — full form + history)

**Backend APIs:**
- `POST /api/v1/client/withdrawals`
- `GET /api/v1/client/withdrawals`

**Database Models:** `withdrawals`, `users` (AGENT)

**Status: ✅ Implemented**

**Evidence:**
- Page calls `getClientWithdrawalsFn()` and `requestClientWithdrawalFn()` — real API.
- Form collects `amount` and `gateway`; type is hardcoded to `COMMISSION`.
- Backend validates that user is an agent and has sufficient `commissionBalance`.
- Balance is deducted immediately upon request; refunded on rejection.

---

## Feature 29 — Investor Dashboard

**Purpose:** Displays investor's key financial stats and allows creating a new investment from the dashboard.

**User Roles:** Investor

**Frontend Pages:** `/investor/dashboard` → `pages/client/investor/dashboard.tsx` (10,627 bytes)

**Backend APIs:** `POST /api/v1/client/investments` (investment creation is wired)

**Database Models:** `investments`, `users`

**Status: 🟡 Partial**

**Evidence:**
- `dashboard.tsx` imports `useCreateInvestment` from `clientInvestments.query.ts` — the create action is real.
- All stat display values are hardcoded dummy strings (`"$12,450.80"`, `"+12.5%"`).
- No API call to fetch real wallet/investment balances for the stats section.
- The "invest" mutation is real; the display data is fake.

---

## Feature 30 — Investor Investments Page

**Purpose:** Investor views their investment portfolio.

**User Roles:** Investor

**Frontend Pages:** `/investor/investments` → `pages/client/investor/investments.tsx`

**Backend APIs:** `GET /api/v1/client/investments`

**Database Models:** `investments`

**Status: ⚪ Placeholder**

**Evidence:**
- `investments.tsx` (110 bytes): `return <div className="p-6 text-white text-xl">Investments</div>;`
- API endpoint exists and is implemented in the backend.
- Frontend page is a text stub only.

---

## Feature 31 — Investor Top-ups Page

**Purpose:** Investor views their top-up history.

**User Roles:** Investor

**Frontend Pages:** `/investor/top-ups` → `pages/client/investor/top-ups.tsx`

**Backend APIs:** `GET /api/v1/client/investments` (filtered by type=TOP_UP)

**Database Models:** `investments`

**Status: ⚪ Placeholder**

**Evidence:**
- `top-ups.tsx` (101 bytes): `return <div className="p-6 text-white text-xl">Top-ups</div>;`

---

## Feature 32 — Investor ROI History Page

**Purpose:** Investor views the history of ROI payments they have received.

**User Roles:** Investor

**Frontend Pages:** `/investor/roi-history` → `pages/client/investor/roi-history.tsx`

**Backend APIs:** None — no `GET /api/v1/client/roi` endpoint exists

**Database Models:** `rois`

**Status: ⚪ Placeholder**

**Evidence:**
- `roi-history.tsx` (109 bytes): `return <div className="p-6 text-white text-xl">ROI History</div>;`
- No client-side ROI history API endpoint exists on the backend.

---

## Feature 33 — Investor Wallet

**Purpose:** Investor views wallet balance, investment balance, ROI balance, total deposits/withdrawals, and full transaction history.

**User Roles:** Investor

**Frontend Pages:** `/investor/wallet` → `pages/client/investor/wallet.tsx` (8,971 bytes)

**Backend APIs:**
- `GET /api/v1/client/wallet`
- `GET /api/v1/client/wallet/transactions`

**Database Models:** `users` (INVESTOR), `deposits`, `withdrawals`

**Status: ✅ Implemented**

**Evidence:**
- Page calls `getClientWalletFn()` and `getClientWalletTransactionsFn()` — real API.
- Backend returns `walletBalance`, `investmentBalance`, `roiBalance` (investor-specific).
- Full transaction ledger rendered from real data.

---

## Feature 34 — Investor Withdrawals

**Purpose:** Investor requests withdrawal from their ROI wallet and views past requests.

**User Roles:** Investor

**Frontend Pages:** `/investor/withdrawals` → `pages/client/investor/withdrawals.tsx` (9,187 bytes)

**Backend APIs:**
- `POST /api/v1/client/withdrawals`
- `GET /api/v1/client/withdrawals`

**Database Models:** `withdrawals`, `users` (INVESTOR)

**Status: ✅ Implemented**

**Evidence:**
- Page calls `getClientWithdrawalsFn()` and `requestClientWithdrawalFn()` — real API.
- Withdrawal type is `ROI_WALLET`.
- Backend deducts `walletBalance` immediately on request; refunds on admin rejection.

---

## Feature 35 — KYC Submission (Client)

**Purpose:** Agent or investor submits identity documents for KYC verification.

**User Roles:** Agent, Investor

**Frontend Pages:** `/agent/kyc` and `/investor/kyc` → `pages/client/shared/kyc.tsx` (7,991 bytes — full form)

**Backend APIs:**
- `POST /api/v1/client/kyc`
- `GET /api/v1/client/kyc`

**Database Models:** `kycs`, `users`

**Status: 🟡 Partial**

**Evidence:**
- Page fully built — collects documentType, documentNumber, documentFrontUrl, documentBackUrl.
- Uses `useSubmitClientKyc` and `useClientKycStatusQuery` hooks — real API.
- **Documents are submitted as URL strings**, not file uploads. Users must provide a pre-hosted image URL; there is no upload button or file picker.
- `multer` is installed but not wired to the KYC endpoint.
- KYC status is correctly shown (Pending, Approved, Rejected with admin remarks).
- Re-submission after rejection is supported.

---

## Feature 36 — Client Notifications

**Purpose:** Agent or investor views their notification feed and can mark notifications as read.

**User Roles:** Agent, Investor

**Frontend Pages:** `/agent/notifications` and `/investor/notifications` → `pages/client/shared/notifications.tsx` (2,890 bytes)

**Backend APIs:**
- `GET /api/v1/client/notifications`
- `PATCH /api/v1/client/notifications/:id/read`

**Database Models:** `notifications`

**Status: ✅ Implemented**

**Evidence:**
- Page uses `useClientNotificationsQuery` and `useMarkNotificationRead` — real API.
- Backend controller returns notifications and unread count.
- Notifications are created automatically by: KYC submission, investor assignment by agent.
- Admin can also manually send notifications to agents.

---

## Feature 37 — Client Profile Management

**Purpose:** Agent or investor views and updates their profile (name, phone, country, address).

**User Roles:** Agent, Investor

**Frontend Pages:** `/agent/profile` and `/investor/profile` → `pages/client/shared/profile-setting.tsx` (9,078 bytes)

**Backend APIs:**
- `GET /api/v1/client/profile`
- `PUT /api/v1/client/profile`

**Database Models:** `users`

**Status: ✅ Implemented**

**Evidence:**
- Page calls `getClientProfileFn()` and `updateClientProfileFn()` directly — real API.
- Backend `updateProfileController` updates: firstName, lastName, mobile, country, address, city, state, zip.
- Full form with save state and toast notifications.

---

## Feature 38 — Client Password Change

**Purpose:** Logged-in agent or investor changes their own password.

**User Roles:** Agent, Investor

**Frontend Pages:** `/agent/change-password` and `/investor/change-password` → `pages/client/shared/change-password.tsx` (5,006 bytes)

**Backend APIs:** `PUT /api/v1/client/profile/password`

**Database Models:** `users`

**Status: ✅ Implemented**

**Evidence:**
- Page calls `updatePasswordController` — real API.
- Backend correctly uses `bcrypt.compare` and `bcrypt.hash` — passwords are properly hashed on change.
- **Note:** This creates an inconsistency — login does NOT use bcrypt (plain text comparison), but password change does use bcrypt. Once a user changes their password, they can no longer log in.

---

## Feature 39 — 2FA Security

**Purpose:** Allow clients to enable/disable Two-Factor Authentication on their accounts.

**User Roles:** Agent, Investor

**Frontend Pages:** `/agent/2fa-security` and `/investor/2fa-security` → `pages/client/shared/2fa-security.tsx` (2,366 bytes)

**Backend APIs:** None

**Database Models:** None

**Status: 🟡 Partial**

**Evidence:**
- Page has a full UI — Enable/Disable toggle with loading spinner.
- Toggle uses `setTimeout` (1 second) and local `useState` only — **no API call is made**.
- No backend route, controller, service, or model for 2FA exists anywhere.
- No TOTP library (e.g., `speakeasy`, `otplib`) is installed.
- UI is complete; functionality is entirely fake.

---

## Feature 40 — ROI Automatic Crediting (Scheduled)

**Purpose:** Automatically credit monthly ROI to investors on their `nextRoiDate`.

**User Roles:** System (automated)

**Frontend Pages:** N/A

**Backend APIs:** No trigger endpoint exists

**Database Models:** `investments`, `rois`, `users`

**Status: 🔴 Not Implemented**

**Evidence:**
- `Investment` model has `roiCycleStartDate` and `nextRoiDate` fields — schema is ready.
- `Roi` model has `monthIndex` field — structure is ready.
- No cron job, scheduler, `setInterval`, or background worker exists anywhere in the backend.
- No npm package for scheduling (e.g., `node-cron`, `bull`, `agenda`) is in `package.json`.
- No API endpoint to manually trigger ROI processing exists either.
- The ROI credit logic must be manually invoked or will never run.

---

## Feature 41 — Commission Distribution (Automatic on Investment)

**Purpose:** When an investor makes an investment or top-up, commissions are automatically distributed up to 4 levels of agents.

**User Roles:** System (triggered by investor investing)

**Frontend Pages:** N/A (triggered server-side)

**Backend APIs:** Called internally from `POST /api/v1/client/investments`

**Database Models:** `commissions`, `users` (AGENT)

**Status: ✅ Implemented**

**Evidence:**
- `clientInvestments.service.ts` — `distributeCommissionService` is called immediately after investment creation.
- Traverses the agent sponsorship chain up to 4 levels.
- Reads commission rates from `Setting` model.
- Credits each agent's `commissionBalance` and creates a `Commission` record.
- If `Setting` is not configured, commission silently skips (no error, no commission paid).

---

## Feature 42 — Investment Creation (Client)

**Purpose:** Investor creates a new investment using their wallet balance.

**User Roles:** Investor

**Frontend Pages:** `/investor/dashboard` (investment form is embedded in the dashboard)

**Backend APIs:** `POST /api/v1/client/investments`

**Database Models:** `investments`, `users` (INVESTOR)

**Status: 🟡 Partial**

**Evidence:**
- `createInvestmentService` in `clientInvestments.service.ts` — fully coded.
- Deducts from wallet, creates Investment record, triggers commission distribution.
- `useCreateInvestment` is imported in `investor/dashboard.tsx`.
- **KYC check is absent** — no guard preventing an investor without approved KYC from investing.
- **No dedicated investment creation page** — the form would live in the dashboard, but the dashboard displays dummy data and it's unclear if the investment form is fully rendered.

---

## Feature 43 — Top-up Creation (Client)

**Purpose:** Investor adds more capital to their account as a new top-up investment.

**User Roles:** Investor

**Frontend Pages:** None found

**Backend APIs:** `POST /api/v1/client/investments` (same endpoint, `type: TOP_UP` implied)

**Database Models:** `investments`

**Status: 🔴 Not Implemented**

**Evidence:**
- The backend `createInvestmentService` hardcodes `type: InvestmentType.INITIAL` — there is no path in the current service to create a `TOP_UP` type investment from the client side.
- No frontend page or form for top-up creation exists for the investor.
- `investor/top-ups.tsx` is a placeholder (101 bytes).

---

## Feature 44 — Investment Close Request (Client)

**Purpose:** Investor requests to close an active investment.

**User Roles:** Investor

**Frontend Pages:** None found

**Backend APIs:** None — no `POST /api/v1/client/investments/:id/close-request` endpoint exists

**Database Models:** `investments`

**Status: 🔴 Not Implemented**

**Evidence:**
- `InvestmentStatus.CLOSE_REQUEST` enum value exists and is used in the admin panel to filter close requests.
- There is no client-side endpoint or frontend UI allowing an investor to submit a close request.
- The admin can see close requests but the client cannot create them via any API.

---

## Feature 45 — Deposit Submission (Client)

**Purpose:** Investor submits a deposit request specifying an amount and payment gateway.

**User Roles:** Investor

**Frontend Pages:** None found

**Backend APIs:** None — no `POST /api/v1/client/deposits` or equivalent endpoint exists

**Database Models:** `deposits`

**Status: 🔴 Not Implemented**

**Evidence:**
- `Deposit` model exists with full schema.
- Admin can view and approve deposits via the admin panel.
- No backend route or controller for a client to submit a deposit request exists.
- No frontend deposit form exists for the investor.
- Deposits appear to be created through another mechanism (manual admin-side entry or an integration that was not built).

---

## Feature 46 — Admin Agent Ban / Unban

**Purpose:** Admin can toggle an agent's active status to prevent or restore their access.

**User Roles:** Admin

**Frontend Pages:** Agent detail page (`components/admin/details.tsx` — includes ban button)

**Backend APIs:** `PUT /api/v1/agents/:username/ban`

**Database Models:** `users`

**Status: ✅ Implemented**

**Evidence:**
- `toggleUserBanService` in `adminUsers.service.ts` toggles `user.isActive`.
- Login check in `auth.service.ts` line 64: `if (!existingUser.isActive)` returns a "banned" error.
- Backend: `toggleBanAgentController` exists.
- **Note:** Only `isActive` is toggled; there is no separate `isBanned` field (the dashboard service incorrectly queries `isBanned: false`, which would always return all users since the field doesn't exist).

---

## Feature 47 — Admin Send Notification to Agent

**Purpose:** Admin sends a custom notification message to a specific agent.

**User Roles:** Admin

**Frontend Pages:** Agent detail page (notification form section in `details.tsx`)

**Backend APIs:** `POST /api/v1/agents/:username/notification`

**Database Models:** `notifications`

**Status: ✅ Implemented**

**Evidence:**
- `sendNotificationService` in `adminUsers.service.ts` creates a `Notification` record.
- `sendNotificationAgentController` is wired to the route.
- Frontend `details.tsx` (21,188 bytes) includes a notification form section.

---

## Feature 48 — Admin Impersonate Agent

**Purpose:** Admin can log in as any agent to inspect their account view.

**User Roles:** Admin

**Frontend Pages:** Agent detail page (impersonate button in `details.tsx`)

**Backend APIs:** `POST /api/v1/agents/:username/impersonate`

**Database Models:** `users`, `admins`

**Status: 🟡 Partial**

**Evidence:**
- Backend `impersonateUserService` generates a valid JWT and sets `clientAccessToken` cookie.
- Backend is complete.
- **Frontend behavior after impersonation is unknown** — the impersonate button exists in `details.tsx` but it's unclear if the frontend redirects the admin to the agent portal after the cookie is set.
- No "exit impersonation" mechanism exists.

---

## Feature 49 — Password Hashing (Security)

**Purpose:** Passwords should be hashed with bcrypt before storage and compared correctly at login.

**User Roles:** System

**Frontend Pages:** N/A

**Backend APIs:** All auth endpoints

**Database Models:** `admins`, `users`

**Status: 🔴 Not Implemented**

**Evidence:**
- `auth.service.ts` line 21: `existingAdmin.password !== password` — plain-text comparison.
- `auth.service.ts` line 57: `existingUser.password !== password` — plain-text comparison.
- `seeders/index.ts` creates admin with raw `'admin123'` string.
- `clientProfile.controller.ts` uses `bcrypt.compare` and `bcrypt.hash` correctly on password *change*.
- This means: (1) all passwords are stored as plain text; (2) once a client changes their password (which hashes it), they can no longer log in since login compares plain text.

---

## Feature 50 — Route Guards / Access Control

**Purpose:** Prevent unauthenticated or wrong-role users from accessing protected pages.

**User Roles:** All

**Frontend Pages:** All protected routes

**Backend APIs:** All protected endpoints

**Status: ✅ Implemented**

**Evidence:**
- Frontend: `protected.route.tsx`, `public.route.tsx`, `client-protected.route.tsx`, `client-public.route.tsx` — 4 guard components exist.
- `client-protected.route.tsx` accepts `allowedRole` prop and blocks wrong-role access.
- Backend: `adminAuthMiddleware` and `clientAuthMiddleware` in `auth.middleware.ts`.
- Admin routes use `router.use(adminAuthMiddleware)`.
- Client routes use `router.use(clientAuthMiddleware)`.

---

## Summary Table

| # | Feature | Status |
|---|---|---|
| 1 | Admin Sign In | 🟡 Partial (no bcrypt) |
| 2 | Client Sign In | 🟡 Partial (no bcrypt) |
| 3 | Admin Dashboard | ✅ Implemented |
| 4 | Agent Management (Admin) | ✅ Implemented |
| 5 | Investor Management (Admin) | ✅ Implemented |
| 6 | KYC Management (Admin) | ✅ Implemented |
| 7 | Investment Management (Admin) | ✅ Implemented |
| 8 | Top-ups Management (Admin) | 🟡 Partial (mock data) |
| 9 | Deposit Management (Admin) | ✅ Implemented |
| 10 | Withdrawal Management — Investor (Admin) | ✅ Implemented |
| 11 | Withdrawal Management — Agent (Admin) | 🟡 Partial |
| 12 | ROI Log (Admin) | ✅ Implemented |
| 13 | Commission Log (Admin) | ✅ Implemented |
| 14 | Reports — 4 reports (Admin) | ✅ Implemented |
| 15 | Investment Report (Legacy Page) | 🟡 Partial (mock data) |
| 16 | Investment Settings (Admin) | 🟡 Partial (mock data, no API) |
| 17 | Admin Branding / App Settings | ✅ Implemented |
| 18 | Client Settings (Admin) | ⚪ Placeholder |
| 19 | Admin Profile Management | ✅ Implemented |
| 20 | Subscribers (Admin) | 🟡 Partial (mock data, no backend) |
| 21 | Agent Dashboard | 🟡 Partial (hardcoded data) |
| 22 | Agent Investor List | ✅ Implemented |
| 23 | Assign User (Agent) | ✅ Implemented |
| 24 | Agent Downline Tree | ✅ Implemented |
| 25 | Agent Team Page | ⚪ Placeholder |
| 26 | Agent Commissions Page | ⚪ Placeholder |
| 27 | Agent Wallet | ✅ Implemented |
| 28 | Agent Withdrawals | ✅ Implemented |
| 29 | Investor Dashboard | 🟡 Partial (hardcoded data) |
| 30 | Investor Investments Page | ⚪ Placeholder |
| 31 | Investor Top-ups Page | ⚪ Placeholder |
| 32 | Investor ROI History | ⚪ Placeholder |
| 33 | Investor Wallet | ✅ Implemented |
| 34 | Investor Withdrawals | ✅ Implemented |
| 35 | KYC Submission (Client) | 🟡 Partial (URL only, no file upload) |
| 36 | Client Notifications | ✅ Implemented |
| 37 | Client Profile Management | ✅ Implemented |
| 38 | Client Password Change | ✅ Implemented |
| 39 | 2FA Security | 🟡 Partial (fake toggle, no backend) |
| 40 | ROI Auto-crediting (Scheduler) | 🔴 Not Implemented |
| 41 | Commission Distribution (Auto) | ✅ Implemented |
| 42 | Investment Creation (Client) | 🟡 Partial (no KYC check) |
| 43 | Top-up Creation (Client) | 🔴 Not Implemented |
| 44 | Investment Close Request (Client) | 🔴 Not Implemented |
| 45 | Deposit Submission (Client) | 🔴 Not Implemented |
| 46 | Admin Agent Ban/Unban | ✅ Implemented |
| 47 | Admin Send Notification to Agent | ✅ Implemented |
| 48 | Admin Impersonate Agent | 🟡 Partial (no exit mechanism) |
| 49 | Password Hashing (Security) | 🔴 Not Implemented |
| 50 | Route Guards / Access Control | ✅ Implemented |

### Counts
| Status | Count |
|---|---|
| ✅ Implemented | 22 |
| 🟡 Partial | 15 |
| 🔴 Not Implemented | 6 |
| ⚪ Placeholder | 5 |
| ❓ Unknown | 0 |
| **Total** | **50** |
