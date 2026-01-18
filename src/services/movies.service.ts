import { Prisma } from "@prisma/client";
import { prisma } from "../config";

export const addMovie = async (data: Prisma.MovieCreateInput) => {
    const newMovie = await prisma.movie.create({
        data: data
    });

    return newMovie;
};


export const deleteMovie = async(id : number) => {
    const response = await prisma.movie.delete({
        where : { id }
    });

    return response;
}

export const getMovie = async(id : number) => {
    const movie = await prisma.movie.findUnique({
        where : {id}
    });

    return movie;
};

export const getAllMovies = async() => {
    const allMovies = await prisma.movie.findMany({
        orderBy : {
            createdAt : 'desc'
        }
    });
    
    return allMovies;
}

