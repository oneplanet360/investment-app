# 04 - Database

The system uses MongoDB with Mongoose.

## Core Models

### `users` Collection
Uses Mongoose discriminators to store multiple roles in one collection.
- `User` (Base Schema): Email, password, name, walletBalance, kycStatus, isActive.
- `Agent` (Discriminator): Adds `sponsor` (ObjectId), `commissionBalance`, `level` (1-4), `downlineCount`.
- `Investor` (Discriminator): Adds `referredBy` (ObjectId), `investmentBalance`, `roiBalance`.
- `admins` Collection: Separate collection for system administrators.

### Financial Collections
- `investments`: Tracks active, completed, or closed investments. Includes `roiCycleStartDate` and `nextRoiDate`.
- `deposits`: User top-up requests (pending, approved, rejected).
- `withdrawals`: Records payout requests. Supports `ROI_WALLET` and `COMMISSION` types.
- `rois`: Log of ROI distributions credited to investors.
- `commissions`: Log of commissions paid to agents up the 4-level chain.

### Support Collections
- `kycs`: User identity verification documents.
- `settings`: System-wide settings (monthly ROI percentage, commission tier percentages).
- `adminsettings`: Branding configurations (logos, colors).
- `notifications`: Alerts for admins and users.

## References
- See [18-edge-cases.md](./18-edge-cases.md) regarding missing DB transactions.
