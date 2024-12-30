import mongoose, { Document, Model, Schema } from 'mongoose';

// Extend AddProject with Mongoose-specific fields
export interface ProjectDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  projectUrl: string;
  projectImage: { url: string }[];
  projectThumbnail?: string;
  tags: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const projectSchema: Schema<ProjectDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    projectUrl: {
      type: String,
      required: true,
    },
    projectImage: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    projectThumbnail: {
      type: String,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        default: [],
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    toJSON: {
      virtuals: true,
      transform: async (_doc, ret) => {
        delete ret.__v; // Remove __v globally
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v; // Remove __v globally
        return ret;
      },
    },
  },
);

// Create the model
export const Project: Model<ProjectDocument> = mongoose.model<ProjectDocument>('Project', projectSchema);
