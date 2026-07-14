# 10 - Business Rules

## 1. Commission Distribution (The 4-Tier System)
When an Investor creates an investment:
1. The service checks the Investor's `referredBy` (Sponsor).
2. The Sponsor (Level 4 Agent) receives the Level 4 commission percentage.
3. The Sponsor's Sponsor (Level 3 Agent) receives the Level 3 commission percentage.
4. This traverses up exactly 4 levels.
5. If the chain ends early (e.g. hits a Level 1 agent), the traversal stops safely.

## 2. ROI Cycles
- Investments operate on a 30-day cycle (`roiCycleStartDate` to `nextRoiDate`).
- **Missing Logic:** The system intends to automatically credit the investor's wallet every 30 days, but no cron job or scheduled worker is implemented in the codebase.

## 3. Top-ups
- Adding funds to an existing investment is treated as a new `Investment` record with `type: TOP_UP`.
- This triggers a fresh commission distribution for the top-up amount.
- **Missing Logic:** The client-side logic to trigger a top-up does not exist.

## 4. Withdrawal Limits
- The specification dictates that users may only withdraw once per month.
- **Missing Logic:** The `requestWithdrawalController` does not enforce this limit.
