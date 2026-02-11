import { prisma, Logger } from '../config';
import { AppError } from '../utils/AppError';
import { CreateSeatsInput } from '../schema/seat.schema';

// Bulk create seats for a screen
export const createSeats = async (data: CreateSeatsInput) => {
    Logger.info(`SeatService : createSeats : Creating seats for screen ${data.screenId}`);

    // Verify screen exists
    const screen = await prisma.screen.findUnique({
        where: { screenId: data.screenId }
    });

    if (!screen) {
        Logger.error(`SeatService : createSeats : Screen not found: ${data.screenId}`);
        throw new AppError('Screen not found', 404);
    }

    // Generate seat data
    const seatsData: { row: string; number: number; screenId: number }[] = [];

    for (const row of data.rows) {
        for (let num = 1; num <= data.seatsPerRow; num++) {
            seatsData.push({
                row: row.toUpperCase(),
                number: num,
                screenId: data.screenId
            });
        }
    }

    // Bulk insert
    const result = await prisma.seat.createMany({
        data: seatsData,
        skipDuplicates: true
    });

    Logger.info(`SeatService : createSeats : Created ${result.count} seats for screen ${data.screenId}`);

    return {
        count: result.count,
        screenId: data.screenId,
        rows: data.rows,
        seatsPerRow: data.seatsPerRow
    };
};

export const getSeatsByScreen = async (screenId: number) => {
    Logger.info(`SeatService : getSeatsByScreen : Fetching seats for screen ${screenId}`);

    const seats = await prisma.seat.findMany({
        where: { screenId },
        orderBy: [{ row: 'asc' }, { number: 'asc' }]
    });

    Logger.info(`SeatService : getSeatsByScreen : Found ${seats.length} seats`);
    return seats;
};

export const getAvailableSeats = async (showtimeId: number) => {
    Logger.info(`SeatService : getAvailableSeats : Fetching available seats for showtime ${showtimeId}`);

    // Get showtime with screen
    const showtime = await prisma.showtime.findUnique({
        where: { showtimeId },
        include: { screen: { include: { seats: true } } }
    });

    if (!showtime) {
        Logger.error(`SeatService : getAvailableSeats : Showtime not found: ${showtimeId}`);
        throw new AppError('Showtime not found', 404);
    }

    // Get booked seat IDs for this showtime
    const bookedTickets = await prisma.ticket.findMany({
        where: { showtimeId },
        select: { seatId: true }
    });

    const bookedSeatIds = new Set(bookedTickets.map(t => t.seatId));

    // Mark seats as available or booked
    const seatsWithAvailability = showtime.screen.seats.map(seat => ({
        ...seat,
        isAvailable: !bookedSeatIds.has(seat.seatId)
    }));

    const available = seatsWithAvailability.filter(s => s.isAvailable).length;
    const booked = seatsWithAvailability.filter(s => !s.isAvailable).length;

    Logger.info(`SeatService : getAvailableSeats : ${available} available, ${booked} booked`);

    return {
        showtimeId,
        screenId: showtime.screenId,
        totalSeats: seatsWithAvailability.length,
        availableCount: available,
        bookedCount: booked,
        seats: seatsWithAvailability
    };
};
