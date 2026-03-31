import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app = express();

// Middleware setupd
app.use(express.json());
app.use(
    cors({
        methods: 'GET, POST, PUT, PATCH, DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    }),
);

app.use(bodyParser.json());

// Route handlers
app.use('/api/v1', router);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to your backend server!');
});

// Use global error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;