import mongoose from 'mongoose';

export const connectDB = async (url: string) => {
    try {
        await mongoose.connect(url);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('An unknown error occurred.');
        }
        process.exit(1);
    }

};