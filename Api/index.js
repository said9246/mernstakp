
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';
import path from 'path';


const app = express();
dotenv.config();
  app.use(express.json());//it is use to allow the singup data from server
app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});



// // 1-database connection
console.log("DB_URI:", process.env.DB_URI);
mongoose.connect(process.env.DB_URI, {
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
})   
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


  const __dirname = path.resolve();



app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
