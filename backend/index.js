import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import dbConnect from "./dbConfig/dbConnect.js";
import authRouter from "./routes/Auth.route.js";
import quizRouter from "./routes/Quiz.route.js";
import testGiverRouter from "./routes/TestGiver.route.js";
import tester from "./routes/NewTestController.js";
dotenv.config();
const app =express();
const PORT = process.env.PORT || 5000;
const allowedOrigin = process.env.ORIGIN;


dbConnect();

console.log('CORS Origin:', process.env.ORIGIN);
const corsOptions = {
  origin: process.env.ORIGIN, // should exactly match frontend origin
  credentials: true, // allow cookies and credentials
};


app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); 
app.use(express.json());
app.use(cookieParser());
const commonUrl = '/api/v1'


app.use(`${commonUrl}/auth`,authRouter)
app.use(`${commonUrl}/quiz`,quizRouter)
app.use(`${commonUrl}/attempt`,testGiverRouter)
app.use(`${commonUrl}/tests`,tester)



app.get('/', (req, res) => {
  res.send('Checking route');
});


app.listen(PORT, () => {
  console.log(`app is running on port: ${PORT}`);
});

