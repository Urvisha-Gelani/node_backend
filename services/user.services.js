import jwt from "jsonwebtoken";
import { sendUserRegisterEmail } from "./email.services.js";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import { generateUniqueId } from "../helpers/index.js";
import User from "../models/Auth.model.js";
dotenv.config();

const userRegister = async (userData) => {
  const nextUserId = await generateUniqueId("userId");
  const token = jwt.sign({ id: nextUserId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  logger.info(`Generated token: ${token}`);
  logger.info(`User data: ${userData}`);
  const tempUser = new User({
    id: nextUserId,
    ...userData,
    token,
  });
  const { username, email } = userData;
  await tempUser.save();
  await sendUserRegisterEmail(username, email);
  return tempUser;
};

export default userRegister;
