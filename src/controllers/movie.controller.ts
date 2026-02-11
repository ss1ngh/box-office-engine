import { Logger } from '../config';
import { StatusCodes } from 'http-status-codes';
import { MovieService } from '../services';
import asyncHandler from '../utils/async-handler';
import { Request, Response } from 'express';


export const addMovie = asyncHandler(async (req: Request, res: Response) => {
    Logger.info('MovieController : addMovie : Request Received');

    const response = await MovieService.addMovie(req.body);

    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Successfully added the movie',
        data: response,
        err: {}
    });
});

interface MovieParams {
    movieId?: string;
}

export const deleteMovie = asyncHandler(async (req: Request<MovieParams>, res: Response) => {
    const { movieId } = req.params;

    if (!movieId || isNaN(parseInt(movieId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Movie ID',
            data: {},
            error: { explanation: 'The movieId parameter must be a valid number.' }
        });
    }

    const id = parseInt(movieId);
    const response = await MovieService.deleteMovie(id);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Successfully deleted the movie",
        data: response,
        error: {}
    });
});

export const getMovie = asyncHandler(async (req: Request<MovieParams>, res: Response) => {
    const { movieId } = req.params;

    if (!movieId || isNaN(parseInt(movieId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Movie ID',
            data: {},
            error: { explanation: 'The movieId parameter must be a valid number.' }
        });
    }

    const id = parseInt(movieId);
    const response = await MovieService.getMovie(id);

    if (!response) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Movie not found',
            data: {},
            error: { explanation: `No movie found with ID ${movieId}` }
        });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Successfully fetched the Movie',
        data: response,
        error: {}
    });
});


export const getAllMovies = asyncHandler(async (req: Request, res: Response) => {
    const response = await MovieService.getAllMovies();

    if (!response) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: true,
            message: 'No Movies found',
            data: {},
            error: { explanation: 'Movies not found, movie library empty' }
        });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Successfully fetched all movies',
        data: response,
        error: {}
    })
});
