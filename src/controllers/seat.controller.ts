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

export const getSeatsByScreen = asyncHandler(async (req: Request, res: Response) => {
    const screenId = parseInt(req.params.screenId as string);
    Logger.info(`SeatController : getSeatsByScreen : Fetching seats for screen ${screenId}`);

    const seats = await SeatService.getSeatsByScreen(screenId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Seats fetched successfully',
        data: seats,
        error: {}
    });
});

export const getAvailableSeats = asyncHandler(async (req: Request, res: Response) => {
    const showtimeId = parseInt(req.params.showtimeId as string);
    Logger.info(`SeatController : getAvailableSeats : Fetching available seats for showtime ${showtimeId}`);

    const result = await SeatService.getAvailableSeats(showtimeId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Available seats fetched successfully',
        data: result,
        error: {}
    });
});
