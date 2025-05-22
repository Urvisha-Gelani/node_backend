import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import User from "../models/Auth.model.js";
import userRegister from "../services/user.services.js";
dotenv.config();
logger.info(`JWT_SECRET: ${process.env.JWT_SECRET}`);
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(422).json({ message: "Email already registered" });
    }

    const newUser = await userRegister({ username, email, password });
    console.log(newUser, "newUser");
    logger.info(`New user registered: ${newUser}`);

    res.status(201).json(newUser);
  } catch (err) {
    logger.error(`Registration error: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
};
