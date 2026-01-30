import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodObject } from 'zod';
import { AppError } from '../utils/appError.js';

export const validate = (schema: ZodObject<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a readable string
        const message = error.issues.map(e => e.message).join(', ');
        next(new AppError(message, 400));
      } else {
        next(error);
      }
    }
  };