import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import User from "../models/Auth.model.js";
import userRegister from "../services/user.services.js";
import { sendWelcomeEmail } from "../services/email.services.js";
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(422).json({ message: "Invalid credentials" });
    }
    console.log(user, "user");
    const { username } = user;
    let token = user.token;
    let isTokenExpired = false;

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        logger.info("Existing token is valid");
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          isTokenExpired = true;
          logger.info("Existing token has expired, generating new one");
        } else {
          logger.error("Invalid token format");
          return res.status(401).json({ message: "Invalid token" });
        }
      }
    } else {
      isTokenExpired = true;
    }

    if (isTokenExpired) {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      user.token = token;
      await user.save();
      logger.info("New token generated and saved");
    }
    res.setHeader("Authorization", `Bearer ${token}`);
    await sendWelcomeEmail(user.email, token, username);
    logger.info(`Welcome email sent to ${user.email}`);

    return res.status(200).json({
      message: "Login successful",
      email: user.email,
      token,
    });
  } catch (err) {
    logger.error(`Login error: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Ensure user is authenticated and `req.user` is populated by middleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Invalidate token by clearing it
    req.user.token = null;
    // await req.user.save();

    logger.info(`User ${req.user.email} logged out`);
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    logger.error(`Logout error: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
};
