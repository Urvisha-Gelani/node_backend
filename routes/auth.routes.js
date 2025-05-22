import express from "express";
import { register } from "../controllers/auth.controller.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);

export default userRoutes;
