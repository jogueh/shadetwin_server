import express, { NextFunction, Request, Response } from 'express';
import morgan from "morgan";
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';
import { ApiError } from './errors/apiError';
import cors from 'cors';
import env from './utils/validateEnv';
import userManagementRoutes from './routes/userManagementRoutes';
import userProfileRoutes from './routes/userProfileRoutes';
import userLoadoutManagementRoutes from './routes/userLoadoutManagementRoutes';
import productManagementRoutes from './routes/productManagementRoutes';

const app = express();
// allows us to make requests from the client to the server
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
// allows us to see and understand incoming HTTP requests in your server logs
app.use(morgan("dev"));

// allows us to send json to our server (POST endpoint)
app.use(express.json());

// middleware catches requests that go to this route, then references the route
// base path from app.ts (/auth) + path in router (ex. /login) = final endpoint = /auth/login
// separating base paths (in app.ts) and relative paths (in the router files).
app.use("/api/auth", authRoutes)
app.use("/api/manage-users", userManagementRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/user-loadouts", userLoadoutManagementRoutes);
app.use("/api/product-management", productManagementRoutes);
// just creates the 404 error if the endpoint is not found
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, "Endpoint not found"));
});

// catches all errors passed by next() and defines how to handle them
// error-handling middleware
app.use(errorHandler)

export default app;