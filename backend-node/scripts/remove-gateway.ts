import mongoose from 'mongoose';
import { Withdrawal } from '../src/database/models/withdrawal.model';
import dotenv from 'dotenv';
dotenv.config();

const removeGateway = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const result = await Withdrawal.collection.updateMany({}, { $unset: { gateway: 1 } });
    console.log(`Successfully removed gateway from ${result.modifiedCount} withdrawal documents.`);

    process.exit(0);
  } catch (error) {
    console.error('Error removing gateway:', error);
    process.exit(1);
  }
};

removeGateway();
