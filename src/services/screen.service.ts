import { prisma, Logger } from '../config';
import { AppError } from '../utils/AppError';
import { CreateScreenInput, UpdateScreenInput } from '../schema/screen.schema';

export const createScreen = async (data: CreateScreenInput) => {
    Logger.info(`ScreenService : createScreen : Creating screen: ${data.name} for theater ${data.theaterId}`);

    // Verify theater exists
    const theater = await prisma.theater.findUnique({
        where: { theaterId: data.theaterId }
    });

    if (!theater) {
        Logger.error(`ScreenService : createScreen : Theater not found: ${data.theaterId}`);
        throw new AppError('Theater not found', 404);
    }

    const screen = await prisma.screen.create({
        data: {
            name: data.name,
            capacity: data.capacity,
            theaterId: data.theaterId
        },
        include: { theater: true }
    });

    Logger.info(`ScreenService : createScreen : Screen created with ID: ${screen.screenId}`);
    return screen;
};

export const getAllScreens = async (theaterId?: number) => {
    Logger.info(`ScreenService : getAllScreens : Fetching screens${theaterId ? ` for theater ${theaterId}` : ''}`);

    const where = theaterId ? { theaterId } : {};

    const screens = await prisma.screen.findMany({
        where,
        include: { theater: true, seats: true }
    });

    Logger.info(`ScreenService : getAllScreens : Found ${screens.length} screens`);
    return screens;
};

export const getScreenById = async (screenId: number) => {
    Logger.info(`ScreenService : getScreenById : Fetching screen ID: ${screenId}`);

    const screen = await prisma.screen.findUnique({
        where: { screenId },
        include: {
            theater: true,
            seats: { orderBy: [{ row: 'asc' }, { number: 'asc' }] },
            showtimes: { include: { movie: true } }
        }
    });

    if (!screen) {
        Logger.warn(`ScreenService : getScreenById : Screen not found: ${screenId}`);
    }

    return screen;
};

export const updateScreen = async (screenId: number, data: UpdateScreenInput) => {
    Logger.info(`ScreenService : updateScreen : Updating screen ID: ${screenId}`);

    // Remove undefined keys for exactOptionalPropertyTypes compatibility
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.capacity !== undefined) updateData.capacity = data.capacity;

    const screen = await prisma.screen.update({
        where: { screenId },
        data: updateData,
        include: { theater: true }
    });


    Logger.info(`ScreenService : updateScreen : Screen updated: ${screenId}`);
    return screen;
};

export const deleteScreen = async (screenId: number) => {
    Logger.info(`ScreenService : deleteScreen : Deleting screen ID: ${screenId}`);

    await prisma.screen.delete({
        where: { screenId }
    });

    Logger.info(`ScreenService : deleteScreen : Screen deleted: ${screenId}`);
};