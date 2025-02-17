import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import CustomError from '../errors';
import {User} from '../models/user.model';

export const getAllUsers = async (req: Request, res: Response) => {
    console.log(req.user);

    const users = await User.find({role: 'user'}).select('-password');

    res.status(StatusCodes.OK).json({users});
};

export const getSingleUser = async (req: Request, res: Response) => {
    const user = await User.findOne({_id: req.params.id}).select('-password');

    if (!user) {
        throw new CustomError.NotFoundError(`User not found with id: ${req.params.id}`);
    }

    res.status(StatusCodes.OK).json({user});
};

export const showCurrentUserProfile = (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({user: req.user});
};

export const updateUserProfile = (req: Request, res: Response) => {
    res.send(req.body);
};

export const updateUserPassword = async (req: Request, res: Response) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values');
    }

    const user = await User.findOne({_id: req.user.userId});
    if (!user) {
        throw new CustomError.BadRequestError('User not found');
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid credentials');
    }
    user.password = newPassword;

    await user.save();
    res.status(StatusCodes.OK).json({message: 'Password updated successfully'});

};