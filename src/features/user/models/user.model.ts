import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  mongo_ref: string;
  name: string;
  age: number;
  deletedAt: Date | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    mongo_ref: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
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
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v; // Remove __v globally
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret.__v; // Remove __v globally
        return ret;
      },
    },
  },
);

export const User = mongoose.model<IUser>('User', UserSchema);
