import { Logger } from '../config';
import {StatusCodes} from 'http-status-codes';
import { MovieService } from '../services';
import asyncHandler from '../utils/async-handler';
import { Request, Response } from 'express';


export const addMovie = asyncHandler(async(req : Request, res : Response) => {
    Logger.info('MovieController : addMovie : Request Received' );

    const response = await MovieService.addMovie(req.body);

    return res.status(StatusCodes.CREATED).json({
        success : true,
        message: 'Successfully added the movie',
        data : response,
        err : {}
    });
});

export const deleteMovie = asyncHandler(async(req : Request, res: Response) => {
    const response = await MovieService.deleteMovie(parseInt(req.params.movieId as string));

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Successfully deleted the movie",
        data : response,
        error : {}
    });
});

export const getMovie = asyncHandler(async(req:Request, res:Response) => {
    const {movieId} = req.params;
    const response = await MovieService.getMovie(parseInt(movieId as string));

    if(!response) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success : false,
            message : 'Movie not found',
            data : {},
            error : {explanation : `No movie found with ID ${movieId}`}
        });
    }

    return res.status(StatusCodes.OK).json({
        success : true,
        message : 'Successfully fetched the Movie',
        data : response,
        error : {}
    });
});


export const getAllMovies = asyncHandler(async( req : Request, res : Response) => {
    const response = await MovieService.getAllMovies();

    if(!response) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: true,
            message : 'No Movies found',
            data : {},
            error :  {explanation :  'Movies not found, movie library empty'}
        });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message : 'Successfully fetched all movies',
        data: response,
        error:  {}
    })
})
