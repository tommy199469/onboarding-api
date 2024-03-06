import dotenv from "dotenv";

// initialize configuration
dotenv.config();

const saltRounds = process.env.SALT || 10;

const dateTimeFormat = "YYYY-MM-DD HH:MM:SS";

const authSecret = process.env.AUTH_SECRET;

const sgKey = process.env.SG_KEY;
const openAPI = process.env.OPEN_API;

const awsRegion = process.env.AWS_REGION || "ap-east-1";

const authEndpoint = process.env.AUTH_ENDPOINT || "http://localhost:6005/auth";
const expirationTime = process.env.EXPIRE || 24 * 60 * 60;

export {
  saltRounds,
  dateTimeFormat,
  authSecret,
  awsRegion,
  authEndpoint,
  expirationTime,
  sgKey,
  openAPI,
};
