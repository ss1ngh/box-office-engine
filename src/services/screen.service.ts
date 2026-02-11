import { prisma, Logger } from '../config';
import { CreateScreenInput, UpdateScreenInput } from '../schema/screen.schema';

export const createScreen = async (data: CreateScreenInput) => {
    Logger.info(`ScreenService : createScreen : Creating screen: ${data.name} for theater ${data.theaterId}`);

    // verify theater exists
    const theater = await prisma.theater.findUnique({
        where: { theaterId: data.theaterId }
    });

    if (!theater) {
        Logger.error(`ScreenService : createScreen : Theater not found: ${data.theaterId}`);
        throw Object.assign(new Error('Theater not found'), { statusCode: 404 });
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

    const screens = await prisma.screen.findMany({
        ...(theaterId ? { where: { theaterId } } : {}),
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

    // remove undefined properties
    const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
    );

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