import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';
import {IUserDocument, IUserModel} from '../interfaces/user.interface';

const UserSchema = new mongoose.Schema<IUserDocument>({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: (value: string): boolean => validator.isEmail(value),
            message: 'Please provide a valid email address',
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);