# 17 - Pending Work

To make the platform production-ready, the following tasks must be completed in order of priority:

## 1. Security & Integrity (Priority: High)
- Implement `bcrypt.compare` for all login routes.
- Implement MongoDB Transactions for `createInvestmentService` and all withdrawal logic.
- Implement atomic `$inc` updates for wallet deductions.
- Add negative amount validation (`amount > 0`).

## 2. Core Business Logic (Priority: High)
- Implement a cron job scheduler (e.g., using `node-cron` or `agenda`) to process 30-day ROI payments automatically.
- Build the Client Deposit UI and API route so investors can fund their wallets.
- Build the Client Top-up UI and API route.

## 3. Policy Enforcement (Priority: Medium)
- Add `kycStatus === 'VERIFIED'` checks to investment, deposit, and withdrawal endpoints.
- Enforce the 1-withdrawal-per-month rule.
- Replace URL-string KYC submission with multipart file uploads (`multer` + S3/Local).

## 4. UI Completion (Priority: Low)
- Replace the 5 placeholder pages with real data tables.
- Wire up the Agent and Investor dashboards to real API data instead of hardcoded strings.
