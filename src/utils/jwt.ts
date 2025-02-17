import {Response} from 'express';
import jwt from 'jsonwebtoken';
import {IJwtPayload} from '../interfaces/jwt.interface';

export const createJWT = ({payload}: { payload: IJwtPayload }): string => {
    if (!process.env.JWT_SECRET || !process.env.JWT_LIFETIME) {
        throw new Error('JWT_SECRET or JWT_LIFETIME have not been set in the environment file (.env).');
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
};

export const isTokenValid = ({token}: { token: string }): IJwtPayload => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET have not been set in the environment file (.env).');
    }

    return jwt.verify(token, process.env.JWT_SECRET) as IJwtPayload;
};

export const attachCookiesToResponse = ({res, user}: { res: Response, user: IJwtPayload }) => {
    const token = createJWT({payload: user});

    const oneDay = 86400000;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });
};