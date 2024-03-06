import "reflect-metadata"; // TypeORM Required
import express from "express";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
// initialize configuration
import * as Controller from "./controller";
dotenv.config();

const prefix = "/api";
const cors = require("cors");
const aws = require("aws-sdk");
const helmet = require("helmet");

var multerS3 = require("multer-s3");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Config
const port = process.env.SERVER_PORT || 8080; // default port to listen
const serverUrl = process.env.SERVER_URL || "http://loalhost";

const demoLogger = (req: any, res: any, next: any) => {
  const now = new Date();
  const formatted_date =
    now.getFullYear() +
    "-" +
    (now.getMonth() + 1) +
    "-" +
    now.getDate() +
    " " +
    now.getHours() +
    ":" +
    now.getMinutes() +
    ":" +
    now.getSeconds();
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  const log = `[${formatted_date}] ${method}:${url} ${status}`;
  console.log(log);
  next();
};

app.use(demoLogger);

app.get(prefix + "/uvi", Controller.getUv);
app.post(prefix + "/subscribe", Controller.subscribe);

// start the Express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at ${serverUrl}:${port}`);
});
