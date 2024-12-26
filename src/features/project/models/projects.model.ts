import mongoose, { Document, Model, Schema } from 'mongoose';

import { AddProject } from '../../../common/types/types';

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

// Create the model
export const Project: Model<ProjectDocument> = mongoose.model<ProjectDocument>('Project', projectSchema);
