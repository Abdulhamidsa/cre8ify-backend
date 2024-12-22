import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  mongo_ref: string;
  email: string;
  name: string;
  age: number;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    mongo_ref: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
  },
  { timestamps: true }
);

const Users = mongoose.model<IUser>("Users", UserSchema);
export default Users;
