import mongoose from 'mongoose';
import validator from 'validator';
import bcryp from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please a valid email address'
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

UserSchema.pre('save', async function () {
    const salt = await bcryp.genSalt(10);
    this.password = await bcryp.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcryp.compare(password, this.password);

};

export const User = mongoose.model('User', UserSchema);