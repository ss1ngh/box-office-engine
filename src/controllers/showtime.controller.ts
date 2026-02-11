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

interface ShowtimeQuery {
    movieId?: string;
    screenId?: string;
    date?: string;
}

export const getAllShowtimes = asyncHandler(async (req: Request<{}, {}, {}, ShowtimeQuery>, res: Response) => {
    Logger.info('ShowtimeController : getAllShowtimes : Request Received');

    const filters: { movieId?: number; screenId?: number; date?: string } = {};

    if (req.query.movieId) {
        if (isNaN(parseInt(req.query.movieId))) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid Movie ID',
                data: {},
                error: { explanation: 'movieId must be a number' }
            });
        }
        filters.movieId = parseInt(req.query.movieId);
    }
    if (req.query.screenId) {
        if (isNaN(parseInt(req.query.screenId))) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Invalid Screen ID',
                data: {},
                error: { explanation: 'screenId must be a number' }
            });
        }
        filters.screenId = parseInt(req.query.screenId);
    }
    if (req.query.date) {
        filters.date = req.query.date;
    }

    const showtimes = await ShowtimeService.getAllShowtimes(filters);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Showtimes fetched successfully',
        data: showtimes,
        error: {}
    });
});

interface ShowtimeParams {
    showtimeId?: string;
}

export const getShowtimeById = asyncHandler(async (req: Request<ShowtimeParams>, res: Response) => {
    const { showtimeId } = req.params;

    if (!showtimeId || isNaN(parseInt(showtimeId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Showtime ID',
            data: {},
            error: { explanation: 'The showtimeId parameter must be a valid number.' }
        });
    }

    const id = parseInt(showtimeId);
    Logger.info(`ShowtimeController : getShowtimeById : Fetching showtime ${id}`);

    const showtime = await ShowtimeService.getShowtimeById(id);

    if (!showtime) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Showtime not found',
            data: {},
            error: { explanation: `No showtime found with ID ${id}` }
        });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Showtime fetched successfully',
        data: showtime,
        error: {}
    });
});

export const updateShowtime = asyncHandler(async (req: Request<ShowtimeParams>, res: Response) => {
    const { showtimeId } = req.params;

    if (!showtimeId || isNaN(parseInt(showtimeId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Showtime ID',
            data: {},
            error: { explanation: 'The showtimeId parameter must be a valid number.' }
        });
    }

    const id = parseInt(showtimeId);
    Logger.info(`ShowtimeController : updateShowtime : Updating showtime ${id}`);

    const showtime = await ShowtimeService.updateShowtime(id, req.body);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Showtime updated successfully',
        data: showtime,
        error: {}
    });
});

export const deleteShowtime = asyncHandler(async (req: Request<ShowtimeParams>, res: Response) => {
    const { showtimeId } = req.params;

    if (!showtimeId || isNaN(parseInt(showtimeId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Showtime ID',
            data: {},
            error: { explanation: 'The showtimeId parameter must be a valid number.' }
        });
    }

    const id = parseInt(showtimeId);
    Logger.info(`ShowtimeController : deleteShowtime : Deleting showtime ${id}`);

    await ShowtimeService.deleteShowtime(id);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Showtime deleted successfully',
        data: {},
        error: {}
    });
});
