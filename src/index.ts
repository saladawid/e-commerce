import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'express-async-errors';
import {connectDB} from './db/connect';
import {notFound} from './middleware/not-found';
import {handleError} from './middleware/error-handler';


dotenv.config();
const port = process.env.PORT || 3000;
const app = express();


const start = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL is not defined in environment variables');
        }
        await connectDB(process.env.MONGO_URL);
        app.listen(3000, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(notFound);
app.use(handleError);

start();