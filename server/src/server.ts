// server/src/server.ts
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/routes';
import cors from 'cors';
import DB from "./config/db";
import cookieParser from 'cookie-parser';
import ws from 'ws';

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(cookieParser());

const PORT = process.env.PORT || 2000;

app.use(express.json());

DB();

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true, // Allow cookies to be sent
}));

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
