import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSetting extends Document {
  appName: string;
  frontendUrl: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  backgroundColor: string;
  sidebarColor: string;
  fontFamily: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSettingSchema = new Schema<IAdminSetting>(
  {
    appName: {
      type: String,
      default: 'Finzip',
    },
    frontendUrl: {
      type: String,
      default: 'https://localhost:5174',
    },
    logoUrl: {
      type: String,
      default: 'https://via.placeholder.com/150x50?text=Admin+Logo',
    },
    faviconUrl: {
      type: String,
      default: 'https://via.placeholder.com/32x32?text=F',
    },
    primaryColor: {
      type: String,
      default: '#4f46e5',
    },
    backgroundColor: {
      type: String,
      default: '#f0f2f8',
    },
    sidebarColor: {
      type: String,
      default: '#ffffff',
    },
    fontFamily: {
      type: String,
      default: 'Inter, sans-serif',
    },
  },
  {
    timestamps: true,
  }
);

const AdminSetting = mongoose.model<IAdminSetting>(
  'AdminSetting',
  adminSettingSchema
);

export default AdminSetting;
