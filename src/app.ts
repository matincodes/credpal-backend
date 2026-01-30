import express, { json, urlencoded } from 'express';
import type { Application, Request, Response} from 'express';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import './config/passport.config.js';
import { generateOpenAPIDocument } from './config/swagger.js';
import { corsOptions } from './config/cors.config.js';
import { arcjetMiddleware } from './middlewares/arcjet.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';


//Initialize Express App
const app: Application = express();

//Security and Optimization Middlewares
app.use(helmet());
app.use(hpp());
app.use(compression());

//CORS Configuration
app.use(cors(corsOptions));

//Request Parsing Middlewares
app.use(json());
app.use(urlencoded({ extended: true }));

//Cookie Parsing Middleware
app.use(cookieParser());

//Logging Middleware
app.use(morgan('dev'));

//Arcjet Middleware
app.use(arcjetMiddleware);

//Global Error Handling Middleware
app.use(errorHandler);

//Passport Authentication Middleware
app.use(passport.initialize());

//Generate and Serve Swagger Documentation
const openAPIDocument = generateOpenAPIDocument();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIDocument));

//Basic Route Check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ 
        success: true, 
        message: 'CredPal Backend is running!' 
    });
});

//Export the configured app
export default app;