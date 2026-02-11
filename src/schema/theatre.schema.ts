import {z} from 'zod';

export const createTheatreSchema = z.object({
    name: z.string().min(1, 'Theatre name is required'),
    location: z.string().min(1, 'Location is required'),
});

export const updateTheatreSchema = z.object({
    name : z.string().min(1).optional(),
    location : z.string().min(1).optional(),
});


export type CreateTheatreInput = z.infer<typeof createTheatreSchema>;
export type UpdateTheatreInput = z.infer<typeof updateTheatreSchema>;