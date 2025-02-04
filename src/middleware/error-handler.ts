import {NextFunction, Request, Response} from 'express';
import {CustomAPIError} from '../errors/custom-api';
import {StatusCodes} from 'http-status-codes';


export const handleError = (err: CustomAPIError, _req: Request, res: Response, _next: NextFunction) => {
    console.error(`Middleware handleError: ${err}`);


    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, try again later',
    };

    res
        .status(customError.statusCode)
        .json({
            msg: customError.msg || 'Sorry, please try again later.'
        });
};