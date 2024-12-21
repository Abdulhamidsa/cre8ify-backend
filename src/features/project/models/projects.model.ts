import mongoose, { Schema, Model } from "mongoose";

interface IProjectImage {
  _id: any;
  url: string;
}

export type ProjectSchema = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  projectUrl: string;
  projectImage: IProjectImage[];
  projectThumbnail?: string;
  tags: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};
const projectSchema: Schema<ProjectSchema> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

export const Project: Model<ProjectSchema> = mongoose.model<ProjectSchema>("Project", projectSchema);
