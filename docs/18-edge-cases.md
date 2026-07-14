# 18 - Edge Cases

The following is a condensed list of critical edge cases verified in the codebase.

## 1. Concurrent Updates (Double Spend)
Financial deductions happen sequentially in memory. Rapid consecutive requests can bypass validation, allowing users to withdraw more than their balance.

## 2. Missing Database Transactions
Commission distribution updates 6 distinct models. A server crash mid-loop leaves the database in an irrecoverable state.

## 3. Negative Amounts
Investment creation does not check for `amount > 0`. Submitting a negative amount mathematically adds funds to the user's wallet.

## 4. Impersonation Trap
Admin impersonation overwrites the admin's session cookie with the client's cookie. There is no programmed way back to the admin portal without manually logging out.

## References
- See the full `edge_cases.md` artifact generated earlier for a comprehensive breakdown, evidence, and recommendations.
