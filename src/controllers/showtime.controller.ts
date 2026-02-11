import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/async-handler';
import * as ShowtimeService from '../services/showtime.service';
import { Logger } from '../config';

export const createShowtime = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('ShowtimeController : createShowtime : Request Received');

    const showtime = await ShowtimeService.createShowtime(req.body);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Showtime created successfully',
        data: showtime,
        error: {}
    });
});

export const getAllShowtimes = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('ShowtimeController : getAllShowtimes : Request Received');

    const filters: { movieId?: number; screenId?: number; date?: string } = {};

    if (req.query.movieId) {
        filters.movieId = parseInt(req.query.movieId as string);
    }
    if (req.query.screenId) {
        filters.screenId = parseInt(req.query.screenId as string);
    }
    if (req.query.date) {
        filters.date = req.query.date as string;
    }

    const showtimes = await ShowtimeService.getAllShowtimes(filters);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Showtimes fetched successfully',
        data: showtimes,
        error: {}
    });
});

export const getShowtimeById = asyncHandler(async (req: Request, res: Response) => {
    const showtimeId = parseInt(req.params.showtimeId as string);
    Logger.info(`ShowtimeController : getShowtimeById : Fetching showtime ${showtimeId}`);

    const showtime = await ShowtimeService.getShowtimeById(showtimeId);

    if (!showtime) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Showtime not found',
            data: {},
            error: { explanation: `No showtime found with ID ${showtimeId}` }
        });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Showtime fetched successfully',
        data: showtime,
        error: {}
    });
});

export const updateShowtime = asyncHandler(async (req: Request, res: Response) => {
    const showtimeId = parseInt(req.params.showtimeId as string);
    Logger.info(`ShowtimeController : updateShowtime : Updating showtime ${showtimeId}`);

    const showtime = await ShowtimeService.updateShowtime(showtimeId, req.body);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Showtime updated successfully',
        data: showtime,
        error: {}
    });
});

export const deleteShowtime = asyncHandler(async (req: Request, res: Response) => {
    const showtimeId = parseInt(req.params.showtimeId as string);
    Logger.info(`ShowtimeController : deleteShowtime : Deleting showtime ${showtimeId}`);

    await ShowtimeService.deleteShowtime(showtimeId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Showtime deleted successfully',
        data: {},
        error: {}
    });
});
