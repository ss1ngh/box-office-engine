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

interface ScreenQuery {
    theaterId?: string;
}

export const getAllScreens = asyncHandler(async (req: Request<{}, {}, {}, ScreenQuery>, res: Response) => {
    Logger.info('ScreenController : getAllScreens : Request Received');

    let theaterId: number | undefined;

    if (req.query.theaterId) {
        if (isNaN(parseInt(req.query.theaterId))) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid Theater ID',
                data: {},
                error: { explanation: 'theaterId must be a number' }
            });
        }
        theaterId = parseInt(req.query.theaterId);
    }

    const screens = await ScreenService.getAllScreens(theaterId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Screens fetched successfully',
        data: screens,
        error: {}
    });
});

interface ScreenParams {
    screenId?: string;
}

export const getScreenById = asyncHandler(async (req: Request<ScreenParams>, res: Response) => {
    const { screenId } = req.params;

    if (!screenId || isNaN(parseInt(screenId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Screen ID',
            data: {},
            error: { explanation: 'The screenId parameter must be a valid number.' }
        });
    }

    const id = parseInt(screenId);
    Logger.info(`ScreenController : getScreenById : Fetching screen ${id}`);

    const screen = await ScreenService.getScreenById(id);

    if (!screen) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Screen not found',
            data: {},
            error: { explanation: `No screen found with ID ${id}` }
        });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Screen fetched successfully',
        data: screen,
        error: {}
    });
});

export const updateScreen = asyncHandler(async (req: Request<ScreenParams>, res: Response) => {
    const { screenId } = req.params;

    if (!screenId || isNaN(parseInt(screenId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Screen ID',
            data: {},
            error: { explanation: 'The screenId parameter must be a valid number.' }
        });
    }

    const id = parseInt(screenId);
    Logger.info(`ScreenController : updateScreen : Updating screen ${id}`);

    const screen = await ScreenService.updateScreen(id, req.body);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Screen updated successfully',
        data: screen,
        error: {}
    });
});

export const deleteScreen = asyncHandler(async (req: Request<ScreenParams>, res: Response) => {
    const { screenId } = req.params;

    if (!screenId || isNaN(parseInt(screenId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Screen ID',
            data: {},
            error: { explanation: 'The screenId parameter must be a valid number.' }
        });
    }

    const id = parseInt(screenId);
    Logger.info(`ScreenController : deleteScreen : Deleting screen ${id}`);

    await ScreenService.deleteScreen(id);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Screen deleted successfully',
        data: {},
        error: {}
    });
});