import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  mongoRef: string;
  username: string;
  age: number;
  bio: string;
  country: string;
  profession: string;
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
    bio: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
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
    profession: {
      type: String,
      required: false,
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
