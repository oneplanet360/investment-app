export type Transaction = {
  id: number;
  user: string;
  username: string;
  type: "deposit" | "withdrawal" | "investment" | "profit";
  amount: number;
  status: "completed" | "pending" | "rejected";
  date: string;
};

export const recentTransactions: Transaction[] = [
  { id: 1, user: "Derek Fink", username: "dreekfink00903", type: "deposit", amount: 250.00, status: "completed", date: "2026-06-30T10:15:00" },
  { id: 2, user: "Anna Smith", username: "annasmith", type: "withdrawal", amount: 100.00, status: "pending", date: "2026-06-30T09:42:00" },
  { id: 3, user: "Michael Kelly", username: "mkelly", type: "investment", amount: 500.00, status: "completed", date: "2026-06-29T16:20:00" },
  { id: 4, user: "Jiro Tanaka", username: "tanaka_j", type: "profit", amount: 75.50, status: "completed", date: "2026-06-29T14:05:00" },
  { id: 5, user: "Fatima Al-Rashid", username: "fatima99", type: "deposit", amount: 200.00, status: "completed", date: "2026-06-28T11:30:00" },
  { id: 6, user: "Lucas Ferreira", username: "lucas_br", type: "deposit", amount: 50.00, status: "pending", date: "2026-06-28T08:55:00" },
  { id: 7, user: "Kamau Mwangi", username: "mwangi_k", type: "withdrawal", amount: 25.00, status: "rejected", date: "2026-06-27T17:00:00" },
  { id: 8, user: "Vulner Clow", username: "tamarin", type: "investment", amount: 100.00, status: "completed", date: "2026-06-27T07:39:00" },
];

export const dashboardStats = {
  totalMembers: 567,
  activeMembers: 23,
  newRegistrations: 12,
  totalBusiness: 62493.00,
  totalIncomePaid: 2395.00,
  pendingWithdrawals: 11,
  totalDeposited: 62493.00,
  pendingDeposits: 4,
  rejectedDeposits: 4,
  depositedCharge: 673.93,
  totalWithdrawn: 2395.00,
  rejectedWithdrawals: 2,
  withdrawalCharge: 53.90,
  emailUnverified: 541,
  mobileUnverified: 537,
};