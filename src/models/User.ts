import bcrypt from 'bcrypt';
import mongoose, { Document, Schema } from 'mongoose';
import config from '../config';

export interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hash = await bcrypt.hash(this.password, config.bcryptSaltRounds);
  this.password = hash;
  next();
});

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
