import express, { Express } from "express";
import morgan from "morgan";
import authRouter from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import todoRouter from "./routes/todoRoutes";
import journalRouter from "./routes/journalRoutes";
import dayRouter from "./routes/dayRoutes";

const app: Express = express();

// Development Middleware

// Put data in the request body
app.use(express.json());

// Read cookies
app.use(cookieParser());

// Logging requests
app.use(morgan("dev"));

// Routing
const apiVersion: string = "1";
const apiPrefix: string = `api/v${apiVersion}`;

app.use(`/${apiPrefix}`, authRouter);
app.use(`/${apiPrefix}/todo`, todoRouter);
app.use(`/${apiPrefix}/journal`, journalRouter);
app.use(`/${apiPrefix}/day`, dayRouter);

export default app;
