import {Types} from 'mongoose';
import {IUser} from './user.interface';

export interface IJwtPayload extends Omit<IUser, 'password' | 'email'> {
    userId: Types.ObjectId;
}