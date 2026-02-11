import asyncHandler from '../utils/async-handler';
import { TheaterService } from '../services';
import {Logger, prisma} from '../config';
import { Request, Response } from 'express'; 
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

export const createTheater = asyncHandler(async(req : Request, res: Response)=> {
    Logger.info(`TheaterController : createTheater : Request received`);

    const theater = await TheaterService.createTheater(req.body);

    return res.status(StatusCodes.CREATED).json({
        success : true,
        message : "Theatre created successfully",
        data : {theater},
        error : {}
    });
}); 

export const getAllTheaters = asyncHandler(async(req : Request, res: Response) => {
    Logger.info('TheaterController : getAllTheaters : Request Received');

    const allTheaters = await TheaterService.getAllTheaters();

    return res.status(StatusCodes.CREATED).json({
        success : true,
        message : "Theatre fetched successfully",
        data : {allTheaters},
        error : {}
    });
});

interface TheaterParams {
    theaterId?: string;
}

export const getTheaterById = asyncHandler(async (req: Request<TheaterParams>, res: Response) => {

    const { theaterId } = req.params;

    if (!theaterId || isNaN(parseInt(theaterId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid or missing Theater ID',
            data: {},
            error: { explanation: 'The theaterId parameter must be a valid number.' }
        });
    }

    const id = parseInt(theaterId);
    Logger.info(`TheaterController : getTheaterById : Fetching theater ${id}`);
    
    const theater = await TheaterService.getTheaterById(id);
    
    if (!theater) {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Theater not found',
            data: {},
            error: { explanation: `No theater found with ID ${id}` }
        });
    }
    
    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Theater fetched successfully',
        data: theater,
        error: {}
    });
});

export const updateTheater = asyncHandler(async(req : Request<TheaterParams>, res : Response) => {
    const {theaterId} = req.params;

    if(!theaterId || isNaN(parseInt(theaterId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Theater not found',
            data: {},
            error: { explanation: `No theater found with ID ${theaterId}` }
        });
    }

    Logger.info(`TheaterController : updateTheater : Updating theater ${theaterId}`);

    const id = parseInt(theaterId);
    const theater = TheaterService.updateTheater(req.body,  id);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Theater updated successfully',
        data: theater,
        error: {}
    });
})

export const deleteTheater = asyncHandler(async(req : Request<TheaterParams>, res: Response) => {
    const  {theaterId} = req.params;

    if(!theaterId || isNaN(parseInt(theaterId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Theater not found',
            data: {},
            error: { explanation: `No theater found with ID ${theaterId}` }
        });
    }

    Logger.info(`TheaterController : deleteTheater : Deleting theater ${theaterId}`);

    const id = parseInt(theaterId);
    const theater = TheaterService.deleteTheater(id);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Theater deleted successfully',
        data: {},
        error: {}
    });

});
