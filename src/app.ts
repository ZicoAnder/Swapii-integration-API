import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { connectMongo } from "./@core/database/database.mongo";
import logger from "./util/logger/logger";
import { moviesRouter } from "./api/movies/movies.route";
import { connectMYSQL } from "./@core/database/database.sql";

// create express server
const app: Application = express();

app.set("port", process.env.PORT || 4001);
app.set("env", "production");

app.use(cors());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

// set up error handler
process.on("uncaughtException", (e: any) => {
  logger.log("error", e);
  process.exit(1);
});

process.on("unhandledRejection", (e: any) => {
  logger.log("error", e);
  process.exit(1);
});

//connect mongo database
// connectMongo();

//connect sql database
connectMYSQL()

//Routes
app.use("/api/v1/movies", moviesRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: `Welcome to SWAPI API, click this link for documentation => https://documenter.getpostman.com/view/6889344/UVC5F8Bh#4cf84068-a6ae-4d5b-b1f0-8f972727c32d`,
  });
});

export default app;
