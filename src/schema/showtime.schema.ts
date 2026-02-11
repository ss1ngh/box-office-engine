import { z } from 'zod';

export const createShowtimeSchema = z.object({
    movieId: z.number().int().positive('Movie ID is required'),
    screenId: z.number().int().positive('Screen ID is required'),
    startTime: z.string().datetime('Invalid datetime format'),
    endTime: z.string().datetime('Invalid datetime format'),
    price: z.number().positive('Price must be positive'),
});

export const updateShowtimeSchema = z.object({
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    price: z.number().positive().optional(),
});

export type CreateShowtimeInput = z.infer<typeof createShowtimeSchema>;
export type UpdateShowtimeInput = z.infer<typeof updateShowtimeSchema>;
