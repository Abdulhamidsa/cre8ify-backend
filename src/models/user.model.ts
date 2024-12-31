import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  mongoRef: string;
  username: string;
  age: number;
  friendlyId: string;
  deletedAt: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    mongoRef: {
      type: String,
      unique: true,
      required: true,
    },
    friendlyId: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const User = mongoose.model<IUser>('User', UserSchema);
