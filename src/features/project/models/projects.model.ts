import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the base AddProject type
export type AddProject = {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  projectUrl: string;
  projectImage: { url: string }[];
  projectThumbnail?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Extend AddProject with Mongoose-specific fields
export interface ProjectDocument extends AddProject, Document {}

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
        type: String,
        default: [], // Default to an empty array if undefined
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Create the model
export const Project: Model<ProjectDocument> = mongoose.model<ProjectDocument>('Project', projectSchema);
