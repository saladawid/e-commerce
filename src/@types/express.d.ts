import { Types } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user: {
                name: string;
                userId: Types.ObjectId;
                role: string;
            };
        }
    }
}

export {};
