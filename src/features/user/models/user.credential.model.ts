import mongoose, { Schema, Model } from "mongoose";
import { IUserCredential } from "../../../common/types/user.types";
const userCredentialSchema: Schema<IUserCredential> = new Schema({
  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    trim: true,
  },
});
export const Credential: Model<IUserCredential> = mongoose.model<IUserCredential>("Credential", userCredentialSchema);
