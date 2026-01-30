import type { Response, Request, NextFunction } from 'express'
import { errorResponse } from '../utils/response.js'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)

    //Mongoose bad ObjectId error
    if (err.name === 'CastError') {
        return errorResponse(res, `Resource not found with id of ${err.value}`, 404);
    }

    //Mongoose duplicate key error
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        return errorResponse(res, message, 400);
    }
    //Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val: any) => val.message);
        return errorResponse(res, messages.join(', '), 400);
    }
    errorResponse(res, err, err.statusCode || 500);


}
