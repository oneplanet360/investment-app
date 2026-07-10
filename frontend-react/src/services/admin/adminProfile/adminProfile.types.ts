export interface IAdminProfile {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface AdminProfilePayload {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AdminPasswordPayload {
  currentPassword?: string;
  newPassword?: string;
}
