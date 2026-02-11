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

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.bookingId as string);
    Logger.info(`UserController : getBookingById : Fetching booking ${bookingId}`);

    if (!req.user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Authentication required',
            data: {},
            error: {}
        });
    }

    const booking = await UserService.getBookingById(bookingId, req.user.userId);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Booking fetched successfully',
        data: booking,
        error: {}
    });
});
