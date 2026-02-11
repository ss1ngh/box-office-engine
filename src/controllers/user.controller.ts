import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/async-handler';
import * as UserService from '../services/user.service';
import { Logger } from '../config';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('UserController : getProfile : Request Received');

    // Auth middleware ensures req.user exists
    if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Authentication required',
            data: {},
            error: {}
        });
    }

    const profile = await UserService.getUserProfile(req.user.userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Profile fetched successfully',
        data: profile,
        error: {}
    });
});

export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('UserController : getMyBookings : Request Received');

    if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Authentication required',
            data: {},
            error: {}
        });
    }

    const bookings = await UserService.getUserBookings(req.user.userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Bookings fetched successfully',
        data: bookings,
        error: {}
    });
});

interface BookingParams {
    bookingId?: string;
}

export const getBookingById = asyncHandler(async (req: Request<BookingParams>, res: Response) => {
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
    Logger.info(`UserController : getBookingById : Fetching booking ${id}`);

    if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Authentication required',
            data: {},
            error: {}
        });
    }

    const booking = await UserService.getBookingById(id, req.user.userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Booking fetched successfully',
        data: booking,
        error: {}
    });
});
