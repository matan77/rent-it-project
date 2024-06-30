import bodyParser from "body-parser";
import express, { Express } from "express";
import cors from "cors";
import usersRouter from "./routes/users";
import propertiesRouter from "./routes/properties";
const app: Express = express();

app.use(cors())

app.use(bodyParser.json());
app.use('/api/users', usersRouter);
app.use('/api/properties', propertiesRouter);


export default app;
