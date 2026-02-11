import { z } from 'zod';

export const createTheaterSchema = z.object({
    name: z.string().min(1, 'Theater name is required'),
    location: z.string().min(1, 'Location is required'),
});

export const updateTheaterSchema = z.object({
    name: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
});

export type CreateTheaterInput = z.infer<typeof createTheaterSchema>;
export type UpdateTheaterInput = z.infer<typeof updateTheaterSchema>;