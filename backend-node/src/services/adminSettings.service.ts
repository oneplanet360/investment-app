import AdminSetting, { IAdminSetting } from '../models/admin-setting.model';

export const getAdminSettingsService = async (): Promise<IAdminSetting> => {
  let settings = await AdminSetting.findOne();
  if (!settings) {
    settings = await AdminSetting.create({});
  }
  return settings;
};

export const updateAdminSettingsService = async (
  payload: Partial<IAdminSetting>
): Promise<IAdminSetting> => {
  let settings = await AdminSetting.findOne();
  if (!settings) {
    settings = await AdminSetting.create(payload);
    return settings;
  }

  settings.set(payload);
  await settings.save();
  return settings;
};
