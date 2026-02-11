import { ZodError, ZodType, ZodObject } from "zod";
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { Logger } from "../config";

type ValidationTarget = 'body' | 'query' | 'params';

interface ValidateOptions {
    stripUnknown?: boolean;
}

export const validate = (
    schema: ZodType,
    target: ValidationTarget,
    options: ValidateOptions = {}
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req[target];
            const validated = schema.parse(data);

            req[target] = validated;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                Logger.warn('Validation failed', {
                    path: req.path,
                    method: req.method,
                    target,
                    errors: formattedErrors,
                });

                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'validation failed',
                    data: {},
                    errors: formattedErrors,
                });
            }
            next(error);
        }
    };
};

export const validateBody = (schema: ZodType) => validate(schema, 'body');
export const validateQuery = (schema: ZodType) => validate(schema, 'query');
export const validateParams = (schema: ZodType) => validate(schema, 'params');

export const validateRequest = (schema: ZodObject<any, any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                Logger.warn('Validation failed', {
                    path: req.path,
                    method: req.method,
                    errors: formattedErrors,
                });

                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'validation failed',
                    data: {},
                    errors: formattedErrors,
                });
            }
            return res.status(400).json({ success: false, error });
        }
    };
