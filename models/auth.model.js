import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { hashPasswordMiddleware } from "../middlewares/password.middleware.js";
import { setUpdatedAt } from "../middlewares/updateTimestamp.middleware.js";

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    token: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
  }
);

UserSchema.pre("save", hashPasswordMiddleware);

UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
setUpdatedAt(UserSchema);
const User = mongoose.model("User", UserSchema);
export default User;
