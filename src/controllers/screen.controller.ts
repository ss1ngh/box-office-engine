import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/async-handler';
import * as ScreenService from '../services/screen.service';
import { Logger } from '../config';

export const createScreen = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('ScreenController : createScreen : Request Received');

    const screen = await ScreenService.createScreen(req.body);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Screen created successfully',
        data: screen,
        error: {}
    });
});

export const getAllScreens = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('ScreenController : getAllScreens : Request Received');

    const theaterId = req.query.theaterId ? parseInt(req.query.theaterId as string) : undefined;
    const screens = await ScreenService.getAllScreens(theaterId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Screens fetched successfully',
        data: screens,
        error: {}
    });
});

export const getScreenById = asyncHandler(async (req: Request, res: Response) => {
    const screenId = parseInt(req.params.screenId as string);
    Logger.info(`ScreenController : getScreenById : Fetching screen ${screenId}`);

    const screen = await ScreenService.getScreenById(screenId);

    if (!screen) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Screen not found',
            data: {},
            error: { explanation: `No screen found with ID ${screenId}` }
        });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Screen fetched successfully',
        data: screen,
        error: {}
    });
});

export const updateScreen = asyncHandler(async (req: Request, res: Response) => {
    const screenId = parseInt(req.params.screenId as string);
    Logger.info(`ScreenController : updateScreen : Updating screen ${screenId}`);

    const screen = await ScreenService.updateScreen(screenId, req.body);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Screen updated successfully',
        data: screen,
        error: {}
    });
});

export const deleteScreen = asyncHandler(async (req: Request, res: Response) => {
    const screenId = parseInt(req.params.screenId as string);
    Logger.info(`ScreenController : deleteScreen : Deleting screen ${screenId}`);

    await ScreenService.deleteScreen(screenId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Screen deleted successfully',
        data: {},
        error: {}
    });
});