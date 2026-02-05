import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET, Logger } from "../config";
import { StatusCodes } from "http-status-codes";

declare global {
    namespace Express {
        interface Request {
            user? : {
                userId : number;
                email  : string;
                role  : 'USER' | 'ADMIN';
            };
        }
    }
}

export const authenticate = (req:Request, res:Response, next:NextFunction) => {
    Logger.info(`AuthMiddleware : authenticate : Checking token for ${req.method}${req.path}`);

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        Logger.warn(`AuthMiddleware : authenticate : No token provided`);
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success : false,
            message : 'No token provided',
            data : {},
            error : {}
        });
    }

    const token = authHeader.split(' ')[1];
    if(!token) {
        Logger.warn('AuthMiddleware : authenticate : Token missing after Bearer');
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Token missing',
            data: {},
            error: {}
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
            userId : number;
            email : string;
            role : 'USER' | 'ADMIN';
        };

        req.user = decoded;
        Logger.info(`AuthMiddleware : authenticate : Token valid for user ${decoded.userId}`);
        next();

    } catch(error) {
        Logger.warn('AuthMiddleware : authenticate : Invalid or expired token');
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success : false,
            message : 'Invalid or expired token',
            data : {},
            error : {}
        });
    }
};


export const authorize = (...roles : ('USER' | 'ADMIN') []) => {
    return (req:Request, res:Response, next:NextFunction) => {
        if(!req.user) {
            Logger.warn('AuthMiddleware : authorize : No user attached to request');
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success : false,
                message : 'Not authenticated',
                data : {},
                error : {}
            });
        }

        if(!roles.includes(req.user.role)) {
            Logger.warn(`AuthMiddleware : authorize : User ${req.user.userId} lacks role. Required: ${roles}, Has: ${req.user.role}`);
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You do not have permission to access this resource',
                data: {},
                error: {}
            });
        }
        Logger.info(`AuthMiddleware : authorize : User ${req.user.userId} authorized with role ${req.user.role}`);
        next();
    }
};