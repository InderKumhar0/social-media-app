import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import morgan from 'morgan';
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB).then(() => {
      console.log("Connected to DB.");
    });
  } catch (error) {
    throw error;
  }
};

const __dirname = path.resolve();

const app = express();

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use(express.json());

app.use(cookieParser());
app.use(morgan('dev'));
app.listen(3000, () => {
  connect();
  console.log("Server listening on port 3000");
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
