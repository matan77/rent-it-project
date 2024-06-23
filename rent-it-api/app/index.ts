import bodyParser from "body-parser";
import express, { Express } from "express";
import usersRouter from "./routes/users";
const app: Express = express();


app.use(bodyParser.json());
app.use('/api/users', usersRouter);


export default app;
