import mongoose, { Schema } from 'mongoose';

export type Tag = {
  name: string;
};
const TagSchema: Schema<Tag> = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Tag = mongoose.model<Tag>('Tag', TagSchema);
