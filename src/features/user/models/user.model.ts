import mongoose, { Schema, Model } from "mongoose";
import Professions from "../../../common/data/constants/proffesions";
import { IPersonalInfo } from "../../../common/types/user.types";
import { IUser } from "../../../common/types/user.types";
import Links from "../../../common/data/constants/links";

const userPersonalInfoSchema: Schema<IPersonalInfo> = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
  },
  profession: {
    type: String,
    enum: Professions,
  },
  country: {
    type: String,
  },
  links: [
    {
      name: {
        type: String,
        trim: true,
        enum: Links,
        required: true,
      },
      url: {
        type: String,
        trim: true,
        required: true,
      },
    },
  ],
});

const UserSchema: Schema<IUser> = new Schema(
  {
    friendlyId: {
      type: String,
      unique: true,
      required: true,
    },
    personalInfo: {
      type: userPersonalInfoSchema,
      required: true,
    },
    userRole: {
      type: String,
      default: "user",
    },
    approved: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    profilePicture: {
      type: String,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
