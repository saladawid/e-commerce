import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {User} from '../models/User';
import CustomError from '../errors';
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
    const tokenUser = {name: user.name, userId: user._id, role: user.role};
    attachCookiesToResponse({res, user: tokenUser});
    res.status(StatusCodes.CREATED).json({user});


};

export const login = async (req: Request, res: Response) => {
    res.send('login');
};

export const logout = async (req: Request, res: Response) => {
    res.send('logout');
};