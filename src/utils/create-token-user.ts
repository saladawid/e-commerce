import {IJwtPayload} from '../interfaces/jwt.interface';
import {IUserDocument} from '../interfaces/user.interface';

export const createTokenUser = (user: IUserDocument): IJwtPayload => {
    return {name: user.name, userId: user._id, role: user.role};
};