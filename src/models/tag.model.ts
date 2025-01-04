import mongoose, { Schema } from 'mongoose';

export type Tag = {
  name: string;
};
const TagSchema: Schema<Tag> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Add other fields if necessary
  },
  { timestamps: true },
);

export const Tag = mongoose.model<Tag>('Tag', TagSchema);

// models/Tag.js
// import mongoose, { Schema, model } from 'mongoose';

// const Tag = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     // Add other fields if necessary
//   },
//   { timestamps: true }
// );

// export const Tag = mongoose.model<Tag>('Tag', TagSchema);

// export default Tag;
