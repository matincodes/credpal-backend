import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { errorResponse } from "../utils/response.js";

export const protect = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            errorResponse(res, err.message, 500);
            return;
        }

        // If no user is found, return an unauthorized error
        if (!user) {
            // Differentiate between no token and invalid token
            const message = info?.name === 'TokenExpiredError' ? 'Your token has expired. Please log in again.' : 'Unauthorized access. Please log in.';
            return next(new AppError(message, 401));
        }

        // Attach the user to the request object
        req.user = user;
        next();
    })(req, res, next);
}