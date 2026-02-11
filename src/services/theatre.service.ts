import { Prisma } from "@prisma/client";
import { prisma, Logger } from "../config";

export const createTheater = async(data : Prisma.TheaterCreateInput) => {
    Logger.info(`TheaterService : createTheater : Creating theater: ${data.name}`);

    const theater = await prisma.theater.create( { data } );

    Logger.info(`TheaterService : createTheater : Theater created with ID: ${theater.theaterId}`);

    return theater;
};

export const getAllTheaters = async() => {
    Logger.info('TheaterService : getAllTheaters : Fetching all theaters');

    const allTheaters = await prisma.theater.findMany({
        include : {screens : true}
    });

    Logger.info(`TheaterService : getAllTheaters : Found ${allTheaters.length} theaters`);

    return allTheaters;
}

export const getTheaterById = async(theaterId : number) => {
    Logger.info(`TheaterService : getTheaterById : Fetching theater ID: ${theaterId}`);

    const theater = await prisma.theater.findUnique({
        where : {theaterId},
        include : {
            screens : {  //get all screens for this theater
                include : {
                    seats : true //get all seats for each of those screens
                }
            }
        }
    });

    if(!theater) {
        Logger.warn(`TheaterService : getTheaterById : Theater not found: ${theaterId}`);
    }

    return theater;
}

export const updateTheater = async(data: Prisma.TheaterUpdateInput, theaterId : number) => {

    Logger.info(`TheaterService : updateTheater : Updating theater ID: ${theaterId}`);

    const theater = await prisma.theater.update({
        where : {theaterId},
        data,
    })

    Logger.info(`TheaterService : updateTheater : Theater updated: ${theaterId}`);

    return theater;
}

export const deleteTheater = async(theaterId : number) => {

    Logger.info(`TheaterService : deleteTheater : Deleting theater ID: ${theaterId}`);

    await prisma.theater.delete({
        where : {theaterId}
    });
    
    Logger.info(`TheaterService : deleteTheater : Theater deleted: ${theaterId}`);
}
