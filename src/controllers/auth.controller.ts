import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import CustomError from '../errors';
import {User} from '../models/user.model';
import {createTokenUser} from '../utils/create-token-user';
import {attachCookiesToResponse} from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    const {email, name, password} = req.body;
    const emailAlreadyExists = await User.findOne({email});
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists');
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({email, name, password, role});

    const tokenUser = createTokenUser(user);

    attachCookiesToResponse({res, user: tokenUser});
    res.status(StatusCodes.CREATED).json({user});
};

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Email and password are required');
    }
    const user = await User.findOne({email});
    if (!user) {
        throw new CustomError.BadRequestError('Invalid credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.BadRequestError('Invalid credentials');
    }
    const tokenUser = createTokenUser(user);

    attachCookiesToResponse({res, user: tokenUser});
    res.status(StatusCodes.CREATED).json({user});
};

export const logout = async (_req: Request, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.send('logout');
};