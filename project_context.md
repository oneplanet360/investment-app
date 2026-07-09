# Investment App - Project Context

## User Roles
*   **Admin**: Manages agents, investors, KYC, investments, ROI, commissions, withdrawals, and system settings.
*   **Agent**: Created only by Admin. Can onboard investors, earn level-wise commissions, and request monthly withdrawals.
*   **Investor**: Registers under an agent, completes KYC, invests, tops up investments, earns monthly ROI, and can request withdrawals.

## Investment
*   Investors can invest and top up at any time.
*   Each investment/top-up starts a new 30-day ROI cycle.
*   Monthly ROI: 5%–7% (admin configurable), credited every 30 days from the investment date.

## Agent Commission
*   **Level 1**: 2.00%
*   **Level 2**: 0.50%
*   **Level 3**: 0.75%
*   **Level 4**: 0.75%
*   **Total Distribution**: 4.00%
*   Commissions are paid on every new investment and top-up.

## Withdrawal
*   Investors can request one withdrawal per month.
*   Agents can request one commission withdrawal per month.
*   All withdrawals require Admin approval.

## KYC
*   Mandatory for both Investors and Agents before investing or withdrawing.

## Key Rules
*   Investors cannot refer other investors.
*   Agents are created only by Admin.
*   Only agents can onboard investors.
*   Admin manages ROI percentages, commission settings, investment limits, and approvals.

## Main Modules & Frontends

### `frontend-admin` (Admin Panel)
*   Dashboard, Users, KYC, Investments, ROI, Commissions, Withdrawals, Reports, Settings.

### `frontend-client` (Agent & Investor Panels)
*   **Agent Panel**: Dashboard, Investors, Team, Commissions, Wallet, Withdrawals.
*   **Investor Panel**: Dashboard, Investments, Top-ups, ROI History, Wallet, Withdrawals, KYC.

## Tech Stack

### Backend (`backend-node`)
*   **Core**: Node.js, Express, TypeScript
*   **Database**: MongoDB (Mongoose)
*   **Security & Auth**: bcryptjs, jsonwebtoken, helmet, cors
*   **Validation**: Zod
*   **Other**: multer, winston

### Frontend (`frontend-admin` & `frontend-client`)
*   **Core**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS v4, Lucide React (Icons)
*   **State & Routing**: React Router DOM, React Query (TanStack Query)
*   **UI/UX**: Sonner (Toasts), React Helmet Async, React Error Boundary
