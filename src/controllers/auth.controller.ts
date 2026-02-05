import { Logger } from "../config";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/async-handler";
import { LoginInput, RegisterInput } from "../schema/auth.schema";
import { AuthService } from "../services";
import { StatusCodes } from "http-status-codes";
import { success } from "zod";

export const register = asyncHandler(async (req:Request, res:Response) => {
    Logger.info (`AuthController : register : Request received`);

    const data : RegisterInput = req.body;

    const user = await AuthService.register(data);

    Logger.info(`AuthController : register : Request sent successfully`);

    return res.status(StatusCodes.CREATED).json({
        success : true,
        message:  'User registered successfully',
        data : user,
        error : {},
    });
});


export const login = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
    Logger.info(`AuthController : login : Request received`);

    const data  : LoginInput = req.body;

    const result = AuthService.login(data);

    Logger.info(`AuthController : login : Request sent successfully`);

    return res.status(StatusCodes.OK).json({
        success : true,
        message : 'Login successful',
        data : result,
        error : {},
    });
});