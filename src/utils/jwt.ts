import jwt from 'jsonwebtoken';
import {Types} from 'mongoose';
import {Response} from 'express';

interface Payload {
    name: string;
    userId: Types.ObjectId;
    role: string;
}

export const createJWT = ({payload}: { payload: Payload }): string => {
    if (!process.env.JWT_SECRET || !process.env.JWT_LIFETIME) {
        throw new Error('JWT_SECRET or JWT_LIFETIME have not been set in the environment file (.env).');
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
};


export const isTokenValid = ({token}: { token: string }): boolean => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET have not been set in the environment file (.env).');
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
};

export const attachCookiesToResponse = ({res, user}: { res: Response, user: Payload }) => {
    const token = createJWT({payload: user});
    const oneDay = 86400000;

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,

    });

};