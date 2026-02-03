import {z} from 'zod';

export const createMovieSchema = z.object({
    title : z.string().min(1, 'Title is required'),
    description : z.string().optional(),
    duration: z.number().positive('Duration must be positive'),
    cast: z.array(z.string()).min(1, 'At least one cast member required'),
    trailerUrl: z.url({message : 'Invalid trailer URL'}),
    releaseDate: z.coerce.date(),
});

export const updateMovieSchema = createMovieSchema.partial();

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;