import { z } from 'zod';

export const createSeatsSchema = z.object({
    screenId: z.number().int().positive('Screen ID is required'),
    rows: z.array(z.string().length(1, 'Row must be a single letter (A-Z)')),
    seatsPerRow: z.number().int().positive('Seats per row must be positive'),
});

export type CreateSeatsInput = z.infer<typeof createSeatsSchema>;
