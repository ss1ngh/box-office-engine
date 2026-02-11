import { z } from 'zod';

export const createBookingSchema = z.object({
    showtimeId: z.number().int().positive('Showtime ID is required'),
    seatIds: z.array(z.number().int().positive()).min(1, 'At least one seat is required'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
