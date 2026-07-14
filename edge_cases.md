# Edge Case Analysis — Investment Platform

This document catalogs every edge case, security risk, and validation gap verified directly from the current codebase.

---

## 1. Missing Transactions (Database Inconsistencies)
**Current behavior:** Complex, multi-document financial workflows are executed sequentially without MongoDB transactions (`session.withTransaction`). For example, investing deducts the wallet, adds to investment balance, creates an investment record, and updates up to 4 agents' balances.
**Risk:** **[CRITICAL]** If the Node.js process crashes or the database connection drops mid-execution, the system is left in a corrupted state (e.g., money is deducted from the investor but the investment record is never created, or the investor gets the investment but agents do not get commission).
**Recommendation:** Implement Mongoose sessions and atomic transactions for all financial endpoints (`clientInvestments.service.ts`, `adminWithdrawals.service.ts`, etc.).
**Evidence:** `clientInvestments.service.ts` updates `investor`, creates `Investment`, and loops through `Agent` models calling `.save()` on each individually.
**Confidence:** 100%

## 2. Race Conditions & Concurrent Updates (Double Spend)
**Current behavior:** Financial deductions use in-memory math followed by a `.save()` instead of atomic `$inc` operators.
**Risk:** **[CRITICAL]** A user with $100 can submit two withdrawal requests for $100 simultaneously. Both requests read the balance as $100, pass the validation, and both subtract $100 and `.save()`. The user successfully withdraws $200, creating a negative balance or double spend.
**Recommendation:** Use atomic `$inc: { walletBalance: -amount }` combined with a query filter `walletBalance: { $gte: amount }` to ensure deductions are race-condition-proof.
**Evidence:** `clientWithdrawal.controller.ts` lines 50-52: `if (user.walletBalance < amount) ... user.walletBalance -= amount; await user.save();`
**Confidence:** 100%

## 3. Validation Gaps: Negative Amounts
**Current behavior:** The withdrawal controller checks if `amount <= 0`, but the investment creation service does **not** validate that the amount is positive.
**Risk:** **[HIGH]** A user could bypass the UI and send an API request to invest `-5000`. The check `investor.walletBalance < amount` passes (since a positive balance is greater than negative 5000). The logic `investor.walletBalance -= amount` subtracts negative 5000, **adding** $5000 to their wallet balance out of thin air.
**Recommendation:** Enforce strict `amount > 0` validation using a library like Zod or Joi on every single financial endpoint.
**Evidence:** `clientInvestments.service.ts` line 23 simply checks `if (investor.walletBalance < amount)`.
**Confidence:** 100%

## 4. Broken States & Plain Text Passwords
**Current behavior:** Passwords for both Admins and Clients are checked using strict string equality (`!==`) during login. However, the client password reset endpoint uses `bcrypt.hash`.
**Risk:** **[CRITICAL]** 
1. Total DB compromise exposes all user passwords. 
2. A broken state occurs the moment a user changes their password: it is hashed in the database, but the login endpoint still expects plain text, permanently locking the user out of their account.
**Recommendation:** Refactor `auth.service.ts` to use `bcrypt.compare` for all logins. Seed the admin user with a hashed password.
**Evidence:** `auth.service.ts` line 57: `if (existingUser.password !== password)`. `clientProfile.controller.ts` line 60: `const hashedPassword = await bcrypt.hash(newPassword, salt);`.
**Confidence:** 100%

## 5. KYC Verification Bypass (Missing Edge Case)
**Current behavior:** Users are supposed to complete KYC before interacting with money, but the system does not enforce this constraint.
**Risk:** **[HIGH]** Complete failure of Anti-Money Laundering (AML) and compliance rules. Unverified users can deposit, invest, and withdraw.
**Recommendation:** Add a `user.kycStatus === 'VERIFIED'` check to the deposit, investment, and withdrawal endpoints.
**Evidence:** `createInvestmentService` and `requestWithdrawalController` only verify that the user exists, not their `kycStatus`.
**Confidence:** 100%

## 6. Monthly Withdrawal Limit Bypass (Missing Edge Case)
**Current behavior:** The project requirements state withdrawals are allowed once per month, but no such logic is implemented.
**Risk:** **[MEDIUM]** Users can withdraw daily or hourly, increasing admin workload and bypassing business rules.
**Recommendation:** Add a database query in `requestWithdrawalController` to check if a withdrawal exists for the user in the current calendar month.
**Evidence:** `clientWithdrawal.controller.ts` goes straight from body validation to balance deduction.
**Confidence:** 100%

## 7. File Upload Issues (Vulnerability / Gap)
**Current behavior:** The KYC submission endpoint accepts `documentFrontUrl` and `documentBackUrl` as plain strings in the request body.
**Risk:** **[MEDIUM]** It relies on the client to host the images somewhere else. If the user submits malicious URLs, or if the external links die (link rot), the admin cannot review the documents.
**Recommendation:** Implement `multer` to accept multipart/form-data, upload the files to cloud storage (S3) or local storage, and save the generated URLs.
**Evidence:** `clientKyc.controller.ts` line 15 extracts URLs directly from `req.body`.
**Confidence:** 100%

## 8. Missing Edge Case: Agent Limit Caps
**Current behavior:** Level 4 agents assign investors. But there is no hard cap on how many investors an agent can have, nor is there a cap on how many sub-agents a Level 1-3 agent can have.
**Risk:** **[LOW]** A single agent could abuse the API to assign thousands of fake users to themselves, bloating the tree.
**Recommendation:** Depending on business rules, implement rate limiting or cap constraints.
**Evidence:** `assignUser` controllers simply increment `downlineCount` without checking a maximum limit.
**Confidence:** 100%

## 9. Admin Impersonation Trap (Broken State)
**Current behavior:** The admin can impersonate an agent by setting the `clientAccessToken` cookie.
**Risk:** **[LOW]** The admin's browser is now logged in as the client. There is no "Return to Admin" functionality because the admin token is stored elsewhere (or overwritten if they share a domain). The admin must manually log out and log back in as admin.
**Recommendation:** Store the original admin token safely, or use a specific header/query param for impersonation rather than overwriting the main session cookie.
**Evidence:** `adminAgents.controller.ts` line 81 sets `clientAccessToken` directly on the response.
**Confidence:** 100%

## 10. Missing Commission Configurations
**Current behavior:** If the `Setting` document does not exist, or `commissionLevels` array is empty, the commission service silently fails/returns.
**Risk:** **[LOW]** Agents do not get paid, but the investment still succeeds. This is gracefully handled, but without an admin alert, the business might unknowingly cheat agents out of money.
**Recommendation:** If commission settings are missing, either block investment creation or send an urgent system alert to the admin.
**Evidence:** `clientInvestments.service.ts` line 62: `if (!settings || !settings.commissionLevels...) { return; }`
**Confidence:** 100%
