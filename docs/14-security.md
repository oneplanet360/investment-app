# 14 - Security

The platform has several critical security vulnerabilities that require immediate attention.

## 1. Password Hashing Failure [CRITICAL]
- Passwords at login (`auth.service.ts`) are compared in **plain text** using strict equality (`!==`).
- Admin accounts are seeded in plain text.
- **The Broken State:** The profile "change password" endpoint correctly uses `bcrypt.hash`. Because login uses plain text, if a user changes their password, they will be permanently locked out of their account.

## 2. Race Conditions [CRITICAL]
- Multi-step financial transactions lack database locking or atomic `$inc` operators.
- A user can double-spend their balance by firing multiple concurrent withdrawal or investment requests.

## 3. Negative Amounts [HIGH]
- `createInvestmentService` fails to validate that the investment `amount > 0`. A negative amount will add funds to the user's wallet.

## 4. File Uploads (SSRF / Link Rot) [MEDIUM]
- KYC documents are submitted as raw URLs rather than multi-part file uploads, creating risks of link rot or arbitrary URL injection.

## References
- See [18-edge-cases.md](./18-edge-cases.md) for a complete breakdown of all vulnerabilities.
