import { Prisma } from "@prisma/client";
import { prisma } from "../config";

export const addMovie = async (data: Prisma.MovieCreateInput) => {
    const newMovie = await prisma.movie.create({
        data: data
    });

    return newMovie;
};


export const deleteMovie = async(movieId : number) => {
    const response = await prisma.movie.delete({
        where : { movieId }
    });

    return response;
}

export const getMovie = async(movieId : number) => {
    const movie = await prisma.movie.findUnique({
        where : {movieId}
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

