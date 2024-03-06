import dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";

// initialize configuration
dotenv.config();

const dbAccept = ["mysql", "postgres", "mongodb"];
const dbType: any = dbAccept.includes(process.env.DB_TYPE)
  ? process.env.DB_TYPE
  : "mysql";

const mongoDbOptions =
  dbType === "mongodb"
    ? {
        url: process.env.DB_MONGO_URL || "",
        useUnifiedTopology: true,
        changelogCollectionName: "changelog",
      }
    : null;

const database: ConnectionOptions = {
  name: "connection",
  type: dbType,
  host: process.env.DB_HOST || "",
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  entities: [
    // typeORM will not be able to create database table if we forget to put entity class name here..
    __dirname + "/../entity/*.ts",
  ],
  synchronize: true,
  logging: false,
  ...mongoDbOptions,
};

const dbConnection: { [key: string]: ConnectionOptions } = {
  database,
};

export { dbConnection };
