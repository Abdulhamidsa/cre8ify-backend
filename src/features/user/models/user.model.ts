import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript interface for the full UserProfileDocument
export interface UserProfileDocument extends Document {
  mongo_ref: string; // Unique identifier
  profileComplete: boolean; // Indicates if the profile is complete
  bio?: string;
  age?: number;
  country?: string;
  profession?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const UserProfileSchema: Schema<UserProfileDocument> = new Schema(
  {
    mongo_ref: { type: String, unique: true, required: true },
    profileComplete: { type: Boolean, default: false },
    bio: { type: String, default: null },
    age: { type: Number, default: null },
    country: { type: String, default: null },
    profession: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v; // Remove the __v field
        return ret;
      },
    },
  },
);

// Export the model
export const UserProfile: Model<UserProfileDocument> = mongoose.model<UserProfileDocument>(
  'UserProfile',
  UserProfileSchema,
);
