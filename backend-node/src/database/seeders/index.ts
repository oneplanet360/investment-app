import { initializeMongoConnection } from '../../configs/mongo.config';
import { Admin } from '../models/admin.model';
import { customLogger } from '../../utils';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  try {
    await initializeMongoConnection();

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      customLogger.info(
        `Admin with email ${adminEmail} already exists. Skipping seed.`
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      await Admin.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        isActive: true,
      });
      customLogger.info(`Admin seeded successfully: ${adminEmail}`);
    }

    process.exit(0);
  } catch (error) {
    customLogger.error('Error seeding admin', error);
    process.exit(1);
  }
};

seedAdmin();
