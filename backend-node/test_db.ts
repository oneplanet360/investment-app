import mongoose from 'mongoose';
import { User, Investor } from './src/database/models/user.model';
import { Roi } from './src/database/models/roi.model';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_DB_URI || '');
  const user = await User.findOne({ username: 'reynold09' });
  if (!user) return console.log('no user');
  
  const investor = await Investor.findById(user._id);
  const rois = await Roi.find({ investorId: user._id });
  
  console.log(JSON.stringify({
    walletBalance: investor?.walletBalance,
    roiBalance: investor?.roiBalance,
    rois: rois
  }, null, 2));
  process.exit(0);
}
run();
