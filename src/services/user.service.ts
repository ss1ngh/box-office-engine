import { prisma, Logger } from '../config';

export const getUserProfile = async (userId: number) => {
    Logger.info(`UserService : getUserProfile : Fetching profile for user ${userId}`);

    const user = await prisma.user.findUnique({
        where: { userId },
        select: {
            userId: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true
        }
    });

    if (!user) {
        Logger.warn(`UserService : getUserProfile : User not found: ${userId}`);
        throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return user;
};

export const getUserBookings = async (userId: number) => {
    Logger.info(`UserService : getUserBookings : Fetching bookings for user ${userId}`);

    const bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
            tickets: {
                include: {
                    seat: true,
                    showtime: {
                        include: {
                            movie: true,
                            screen: { include: { theater: true } }
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    Logger.info(`UserService : getUserBookings : Found ${bookings.length} bookings`);
    return bookings;
};

export const getBookingById = async (bookingId: number, userId: number) => {
    Logger.info(`UserService : getBookingById : Fetching booking ${bookingId} for user ${userId}`);

    const booking = await prisma.booking.findUnique({
        where: { bookingId },
        include: {
            tickets: {
                include: {
                    seat: true,
                    showtime: {
                        include: {
                            movie: true,
                            screen: { include: { theater: true } }
                        }
                    }
                }
            }
        }
    });

    if (!booking) {
        Logger.warn(`UserService : getBookingById : Booking not found: ${bookingId}`);
        throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }

    if (booking.userId !== userId) {
        Logger.warn(`UserService : getBookingById : User ${userId} unauthorized for booking ${bookingId}`);
        throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
    }

    return booking;
};
