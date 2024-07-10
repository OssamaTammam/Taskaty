import express, { Express } from "express";
import morgan from "morgan";

const app: Express = express();

// Development Middleware

// Put data in the request body
app.use(express.json());

// Logging requests
app.use(morgan("dev"));

// Routing
const apiVersion: string = "1";
const apiPrefix: string = `api/v${apiVersion}`;

export default app;
