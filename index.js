// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import userRouter from './routes/user.route.js';
// import authRouter from './routes/auth.route.js';
// import cookieParser from 'cookie-parser';
// import listingRouter from './routes/listing.route.js';

// dotenv.config();
// console.log('MONGO from env:', process.env.MONGO);

// mongoose
//   .connect(process.env.MONGO)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.use('/api/listing', listingRouter);
// app.use('/api/user', userRouter);
// app.use('/api/auth', authRouter);

// // health check route
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // error handler
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Internal Server Error';
//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });

// export default app;



import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config({ path: path.resolve(".env") });

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://frontestate.netlify.app",
//   "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

export default app;
