import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 10, // Máximo 10 solicitudes
  duration: 3600, // Por hora
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await rateLimiter.consume(String(req?.ip));
    next();
  } catch {
    res.status(429).send('Too Many Requests');
  }
};
