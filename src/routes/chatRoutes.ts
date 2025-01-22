import express from 'express';
import { sendMessage, getHistory } from '../controllers/chatController';
import { rateLimiterMiddleware } from '../middlewares/rateLimiter';

const router = express.Router();

router.post('/message', rateLimiterMiddleware, sendMessage);
router.get('/history', rateLimiterMiddleware, getHistory);

export default router;
