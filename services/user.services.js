import jwt from "jsonwebtoken";
import { sendUserRegisterEmail } from "./email.services.js";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import { generateUniqueId } from "../helpers/index.js";
import User from "../models/Auth.model.js";
dotenv.config();

const userRegister = async (userData) => {
  const nextUserId = await generateUniqueId("userId");

  logger.info(`User data: ${userData}`);
  const tempUser = new User({
    id: nextUserId,
    ...userData,
  });
  const { username, email } = userData;
  await tempUser.save();
  await sendUserRegisterEmail(username, email);
  return tempUser;
};

export default userRegister;
