import dotenv from 'dotenv';
dotenv.config();

import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    JWT_SECRET: str(),
    JWT_EXPIRATION: str({ default: '1d' }),
    CLIENT_URL: str(),
    EMAIL_USER: str(),
    EMAIL_PASS: str(),
});