import { Decimal } from '@prisma/client/runtime/library';
import { prisma, Logger } from '../config';
import { CreateShowtimeInput, UpdateShowtimeInput } from '../schema/showtime.schema';

export const createShowtime = async (data: CreateShowtimeInput) => {
    Logger.info(`ShowtimeService : createShowtime : Creating showtime for movie ${data.movieId} at screen ${data.screenId}`);

    // Verify movie exists
    const movie = await prisma.movie.findUnique({
        where: { movieId: data.movieId }
    });
    if (!movie) {
        Logger.error(`ShowtimeService : createShowtime : Movie not found: ${data.movieId}`);
        throw Object.assign(new Error('Movie not found'), { statusCode: 404 });
    }

    // Verify screen exists
    const screen = await prisma.screen.findUnique({
        where: { screenId: data.screenId }
    });
    if (!screen) {
        Logger.error(`ShowtimeService : createShowtime : Screen not found: ${data.screenId}`);
        throw Object.assign(new Error('Screen not found'), { statusCode: 404 });
    }

    // Check for overlapping showtimes
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    const overlapping = await prisma.showtime.findFirst({
        where: {
            screenId: data.screenId,
            OR: [
                { startTime: { lte: endTime }, endTime: { gte: startTime } }
            ]
        }
    });

    if (overlapping) {
        Logger.warn(`ShowtimeService : createShowtime : Overlapping showtime detected`);
        throw Object.assign(new Error('This screen has an overlapping showtime'), { statusCode: 409 });
    }

    const showtime = await prisma.showtime.create({
        data: {
            movieId: data.movieId,
            screenId: data.screenId,
            startTime,
            endTime,
            price: new Decimal(data.price)
        },
        include: { movie: true, screen: { include: { theater: true } } }
    });

    Logger.info(`ShowtimeService : createShowtime : Showtime created with ID: ${showtime.showtimeId}`);
    return showtime;
};

export const getAllShowtimes = async (filters?: { movieId?: number; screenId?: number; date?: string }) => {
    Logger.info(`ShowtimeService : getAllShowtimes : Fetching showtimes`);

    const where: any = {};

    if (filters?.movieId) where.movieId = filters.movieId;
    if (filters?.screenId) where.screenId = filters.screenId;
    if (filters?.date) {
        const date = new Date(filters.date);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        where.startTime = { gte: date, lt: nextDay };
    }

    const showtimes = await prisma.showtime.findMany({
        where,
        include: {
            movie: true,
            screen: { include: { theater: true } }
        },
        orderBy: { startTime: 'asc' }
    });

    Logger.info(`ShowtimeService : getAllShowtimes : Found ${showtimes.length} showtimes`);
    return showtimes;
};

export const getShowtimeById = async (showtimeId: number) => {
    Logger.info(`ShowtimeService : getShowtimeById : Fetching showtime ID: ${showtimeId}`);

    const showtime = await prisma.showtime.findUnique({
        where: { showtimeId },
        include: {
            movie: true,
            screen: {
                include: {
                    theater: true,
                    seats: { orderBy: [{ row: 'asc' }, { number: 'asc' }] }
                }
            }
        }
    });

    if (!showtime) {
        Logger.warn(`ShowtimeService : getShowtimeById : Showtime not found: ${showtimeId}`);
    }

    return showtime;
};

export const updateShowtime = async (showtimeId: number, data: UpdateShowtimeInput) => {
    Logger.info(`ShowtimeService : updateShowtime : Updating showtime ID: ${showtimeId}`);

    const updateData: any = {};
    if (data.startTime) updateData.startTime = new Date(data.startTime);
    if (data.endTime) updateData.endTime = new Date(data.endTime);
    if (data.price) updateData.price = new Decimal(data.price);

    const showtime = await prisma.showtime.update({
        where: { showtimeId },
        data: updateData,
        include: { movie: true, screen: { include: { theater: true } } }
    });

    Logger.info(`ShowtimeService : updateShowtime : Showtime updated: ${showtimeId}`);
    return showtime;
};

export const deleteShowtime = async (showtimeId: number) => {
    Logger.info(`ShowtimeService : deleteShowtime : Deleting showtime ID: ${showtimeId}`);

    // Check if there are any bookings
    const ticketCount = await prisma.ticket.count({
        where: { showtimeId }
    });

    if (ticketCount > 0) {
        Logger.warn(`ShowtimeService : deleteShowtime : Cannot delete - has ${ticketCount} tickets`);
        throw Object.assign(new Error('Cannot delete showtime with existing bookings'), { statusCode: 400 });
    }

    await prisma.showtime.delete({
        where: { showtimeId }
    });

    Logger.info(`ShowtimeService : deleteShowtime : Showtime deleted: ${showtimeId}`);
};
