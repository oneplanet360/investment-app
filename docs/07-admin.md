# 07 - Admin

The Admin role is the sole operator of the platform.

## Key Capabilities
- **Gatekeeper:** Admin must approve every Deposit, Withdrawal, and Investment Close Request. Money does not move without admin action.
- **Onboarding:** Investors self-register, but Admin creates all Level 1 Agents manually. Admin must also approve KYC for everyone.
- **Reporting:** Accesses aggregated metrics across investments, ROI distributions, and agent commission leaderboards.
- **System Control:** Configures ROI percentages and 4-tier commission structures (Note: Setting update APIs are partially unimplemented).
- **User Management:** Can ban agents, reset passwords, and send notifications.

## References
- See [11-pages.md](./11-pages.md) for admin UI structure.
- See [16-feature-status.md](./16-feature-status.md) for what admin features actually work.
