import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/async-handler';
import * as BookingService from '../services/booking.service';
import { Logger } from '../config';

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('BookingController : createBooking : Request Received');

    // Auth middleware ensures req.user exists
    if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Authentication required',
            data: {},
            error: {}
        });
    }

    // Explicitly cast or access properties based on schema validation
    const { showtimeId, seatIds } = req.body;

    const booking = await BookingService.createBooking(req.user.userId, showtimeId, seatIds);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
        error: {}
    });
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.bookingId as string);
    Logger.info(`BookingController : cancelBooking : Cancelling booking ${bookingId}`);

    if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Authentication required',
            data: {},
            error: {}
        });
    }

    const booking = await BookingService.cancelBooking(bookingId, req.user.userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
        error: {}
    });
});
