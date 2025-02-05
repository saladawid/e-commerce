import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import {connectDB} from './db/connect';
import {notFound} from './middleware/not-found';
import {handleError} from './middleware/error-handler';
import {router as authRouter} from './routes/authRoutes';


dotenv.config();
const port = process.env.PORT || 3000;
const app = express();


const start = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.error('MONGO_URL is not defined in environment variables');
            process.exit(1);
        }
        await connectDB(process.env.MONGO_URL);
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

app.get('/api/v1', (req, res) => {
    res.send('Hello World');
    console.log(req.cookies);

});
app.use('/api/v1/auth', authRouter);

app.use(notFound);
app.use(handleError);

start();