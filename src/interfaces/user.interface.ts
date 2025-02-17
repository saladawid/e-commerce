import {Document, Model, Types} from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

// Typ Document Mongoose rozszerzony o dodatkowe metody instancji
export interface IUserDocument extends Document, IUser {
    _id: Types.ObjectId;

    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Typ Model Mongoose (dodaj jeśli w przyszłości dodasz statyczne metody)
export interface IUserModel extends Model<IUserDocument> {
}