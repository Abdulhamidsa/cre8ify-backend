import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  mongo_ref: string;
  name: string;
  age: number;
  deletedAt: Date;
  active: boolean;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    mongo_ref: { type: String, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    active: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
