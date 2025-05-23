import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.delete("/logout", authenticateToken, logout);

export default userRoutes;
