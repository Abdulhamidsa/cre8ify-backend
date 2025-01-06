import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface PostBase {
  content?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the unpopulated `userId` type
export interface PostDocument extends PostBase, Document {
  userId: Types.ObjectId; // Unpopulated userId
}

// Define the populated `userId` type
export interface PopulatedPostDocument extends PostBase, Document {
  userId: {
    _id: string;
    username: string;
    profilePicture: string;
  };
}

const postSchema: Schema<PostDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // Store a single image URL
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const Post: Model<PostDocument> = mongoose.model<PostDocument>('Post', postSchema);
