import {NextFunction, Request, Response} from 'express';
import CustomError from '../errors';
import {isTokenValid} from '../utils/jwt';

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.signedCookies.token;
    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }

    try {
        const {name, userId, role} = isTokenValid({token});
        req.user = {name, userId, role};
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
};

export const authorizePermissions = (...roles: string[]) => {

    return (req: Request, res: Response, next: NextFunction) => {
        console.log(roles);
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access this resource');
        }
        next();
    };
};