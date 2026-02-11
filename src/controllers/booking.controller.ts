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

interface BookingParams {
    bookingId?: string;
}

export const cancelBooking = asyncHandler(async (req: Request<BookingParams>, res: Response) => {
    const { bookingId } = req.params;

    if (!bookingId || isNaN(parseInt(bookingId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Booking ID',
            data: {},
            error: { explanation: 'The bookingId parameter must be a valid number.' }
        });
    }

    const id = parseInt(bookingId);
    Logger.info(`BookingController : cancelBooking : Cancelling booking ${id}`);

    if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Authentication required',
            data: {},
            error: {}
        });
    }

    const booking = await BookingService.cancelBooking(id, req.user.userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
        error: {}
    });
});
