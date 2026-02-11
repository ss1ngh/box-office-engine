import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma, JWT_EXPIRES_IN, JWT_SECRET, Logger } from '../config';
import { AppError } from '../utils/AppError';
import { Prisma, Role } from '@prisma/client';
import { LoginInput, RegisterInput } from '../schema/auth.schema';
import { StatusCodes } from 'http-status-codes';


export const register = async (data: RegisterInput) => {
    Logger.info(`AuthService : register : Attempting to register new user with email : ${data.email}`);

    //check for existing user
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });


    if (existingUser) {
        throw new AppError('User with this email already exists', 409);
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    Logger.info(`AuthService : register : Password hashed successfully`);

    //create user
    const user = await prisma.user.create({
        data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: hashedPassword,
        },
        select: {
            userId: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
        }
    });

    Logger.info(`AuthService : register : User created Successfully with ID : ${user.userId}`);
    return user;
}


export const login = async (data: LoginInput) => {
    Logger.info(`AuthService : login : Login attempt for email : ${data.email} `);

    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });


    if (!user) {
        throw new AppError('User does not exist', 401);
    }

    //verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
        throw new AppError('Invalid email or Password', 401);
    }

    //generate jwt token
    const token = jwt.sign(
        { userId: user.userId, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    Logger.info(`AuthService : login : User logged in successfully : ${user.userId}`);

    return {
        user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        },
        token,
    };
};
