import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/async-handler';
import * as SeatService from '../services/seat.service';
import { Logger } from '../config';

export const createSeats = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('SeatController : createSeats : Request Received');

    const result = await SeatService.createSeats(req.body);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: `Created ${result.count} seats successfully`,
        data: result,
        error: {}
    });
});

interface SeatScreenParams {
    screenId?: string;
}

export const getSeatsByScreen = asyncHandler(async (req: Request<SeatScreenParams>, res: Response) => {
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
    Logger.info(`SeatController : getSeatsByScreen : Fetching seats for screen ${id}`);

    const seats = await SeatService.getSeatsByScreen(id);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Seats fetched successfully',
        data: seats,
        error: {}
    });
});

interface SeatShowtimeParams {
    showtimeId?: string;
}

export const getAvailableSeats = asyncHandler(async (req: Request<SeatShowtimeParams>, res: Response) => {
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
    Logger.info(`SeatController : getAvailableSeats : Fetching available seats for showtime ${id}`);

    const result = await SeatService.getAvailableSeats(id);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Available seats fetched successfully',
        data: result,
        error: {}
    });
});
