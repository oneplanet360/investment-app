# 11 - Pages

The application is structured into Admin, Agent, and Investor views.

## Admin Pages (`/pages/admin`)
- **Dashboard:** Top-level metrics and recent transactions.
- **Agent/Investor Management:** Lists, addition forms, and password resets.
- **Investments / Top-ups:** Lists of financial allocations.
- **Deposits / Withdrawals:** Approval queues.
- **KYC:** Identity document review queue.
- **Reports:** Granular data tables for investments, ROI, commissions, and withdrawals.
- **Settings:** Branding configuration.

## Agent Pages (`/pages/client/agent`)
- **Dashboard:** Overview of agent metrics (Currently dummy data).
- **Assign User:** Interface to link users to downline.
- **Tree:** Visual hierarchy of downline up to 4 tiers.
- **Wallet & Withdrawals:** Commission balance and payout requests.
- **Team / Commissions:** (Currently placeholders).

## Investor Pages (`/pages/client/investor`)
- **Dashboard:** Financial overview and investment creation point (Dummy display data).
- **Wallet & Withdrawals:** Balance tracking and payout requests.
- **Investments / Top-ups / ROI History:** (Currently placeholders).

## Shared Client Pages (`/pages/client/shared`)
- **Profile / Password:** User detail management.
- **KYC:** Document submission form.
- **Notifications:** Alerts feed.
- **2FA:** Security toggle (Currently fake UI).
