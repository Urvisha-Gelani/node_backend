import express from "express";
import corsMiddleware from "./config/cors.config.js";
import userRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import jobRoutes from "./routes/job.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import corsMiddleware from "./config/cors.config.js";
// import logInRouter from "./routes/auth.routes.js";
// import errorHandler from "./middlewares/error.middleware.js";
// import path from "path";
// import paymentRouter from "./routes/payment.routes.js";

const app = express();
app.use(corsMiddleware);
app.use(express.json());
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
console.log("process.cwd()", process.cwd());

app.use("/api/v1", userRoutes);
app.use("/api/v1", jobRoutes);
// app.use("/", logInRouter);
// app.use("/", paymentRouter);

app.use(errorHandler);

export default app;
