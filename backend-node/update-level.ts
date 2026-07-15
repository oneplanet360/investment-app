import mongoose from 'mongoose';
import { Agent } from './src/database/models/user.model';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_DB_URI as string);
  console.log('Connected to DB');

  const result = await Agent.updateMany(
    { username: 'agent' },
    { $set: { level: 4 } }
  );

  console.log('Update result for username agent:', result);

  const user = await Agent.findOne({ username: 'agent' });
  console.log('User now:', user);

  await mongoose.disconnect();
};

run().catch(console.error);
