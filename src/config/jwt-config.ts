import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '1d';
export const JWT_REFRESH_EXPIRES_IN = '7d';