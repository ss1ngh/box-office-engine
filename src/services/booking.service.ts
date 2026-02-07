import {prisma, Logger} from '../config';
import { Decimal } from '@prisma/client/runtime/library';

export const createBooking = async(
    userId : number,
    showtimeId : number,
    seatIds : number[],
) => {
    Logger.info(`BookingService : createBooking : User ${userId} booking seats [${seatIds.join(', ')}] for showtime ${showtimeId}`);

    return await prisma.$transaction(async (tx) => {

        const showtime = await tx.showtime.findUnique({
            where  : {showtimeId}
        });

        if(!showtime) {
            Logger.error(`BookingService : createBooking : Showtime not found: ${showtimeId}`);

            throw Object.assign(new Error('Showtime not found'), { statusCode: 404 });
        }


        const existingTickets = await tx.ticket.findMany({
            where : {
                showtimeId,
                seatId : {in : seatIds}
            }
        });

        if(existingTickets.length > 0) {
            const bookedSeats = existingTickets.map(t => t.seatId);
            Logger.warn(`BookingService : createBooking : Seats already booked: [${bookedSeats.join(', ')}]`);
            throw Object.assign( new Error('One or more seats are already booked'), {statusCode : 409});
        }

        //calculate total
        const total = new Decimal(showtime.price.toString()).mul(seatIds.length);
        Logger.info(`BookingService : createBooking : Total calculated: ${total}`);

        //create booking
        const booking = await tx.booking.create({
            data : {
                userId,
                total,
                status : "PENDING",

                tickets : {
                    create : seatIds.map(seatId => ({
                        showtimeId,
                        seatId
                    }))
                }
            },
            include : {
                tickets : {
                    include : {seat : true, showtime: { include : {movie : true} } }
                }
            }
        });
        Logger.info(`BookingService : createBooking : Booking created with ID: ${booking.bookingId}`);
        return booking;
    });
};


export const cancelBooking = async(bookingId : number, userId : number) => {

    Logger.info(`BookingService : cancelBooking : User ${userId} cancelling booking ${bookingId}`);
    const booking = await prisma.booking.findUnique({
        where : {bookingId},
    })

    if(!booking) {
        Logger.error(`BookingService : cancelBooking : Booking not found: ${bookingId}`);
        throw Object.assign(new Error('Booking not found'), {statusCode : 404 });
    }

    if(booking.userId !== userId) {
        Logger.warn(`BookingService : cancelBooking : User ${userId} unauthorized for booking ${bookingId}`);
        throw Object.assign(new Error('Not Authorized'), {statusCode : 403})
    }

    const updated = await prisma.booking.update({
        where : {bookingId},
        data : {status : 'CANCELLED'},
    })

    Logger.info(`BookingService : cancelBooking : Booking cancelled: ${bookingId}`);
    return updated;
}