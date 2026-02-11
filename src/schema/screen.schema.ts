import { z } from 'zod';

export const createScreenSchema = z.object({
    name: z.string().min(1, 'Screen name is required'),
    capacity: z.number().int().positive('Capacity must be a positive integer'),
    theaterId: z.number().int().positive('Theater ID is required'),
});

export const updateScreenSchema = z.object({
    name: z.string().min(1).optional(),
    capacity: z.number().int().positive().optional(),
});

export type CreateScreenInput = z.infer<typeof createScreenSchema>;
export type UpdateScreenInput = z.infer<typeof updateScreenSchema>;
