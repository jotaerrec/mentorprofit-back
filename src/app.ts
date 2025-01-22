import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/database';
import chatRoutes from './routes/chatRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
