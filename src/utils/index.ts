import Express from "express";
const bcrypt = require("bcrypt");
import moment from "moment";
import jwt from "jsonwebtoken";

// import config
import {
  saltRounds,
  dateTimeFormat,
  authSecret,
  expirationTime,
} from "../config";

const handleErrorResponse = (res: Express.Response, error: any) => {
  const { code = 400, message = "System error" } = error;
  return res.status(code).json({ status: false, message });
};

const handleResponse = (res: Express.Response, code: number, data: any) => {
  return res.status(code || 200).json({ status: true, data });
};

const checkRequireField = async (requireField: any[], params: object) => {
  return new Promise(async (resolve, reject) => {
    let missing = "";

    await Promise.all(
      requireField.map((field) => {
        if (!(field in params)) {
          missing += `${field} `;
        }
      })
    );

    if (missing !== "") {
      return reject({ code: 400, message: `${missing}is missing` });
    }

    return resolve(true);
  });
};

// salted password hash function
const passwordHashWithSalt = (password: string) =>
  bcrypt.hashSync(password, saltRounds);

// password verification with salted hash
const verifyPassword = (password: string, passwordDB: string) =>
  bcrypt.compare(password, passwordDB);

// sign JWT token
const signJwt = (data: any) => {
  return jwt.sign(data, authSecret, { expiresIn: expirationTime });
};

const decodeJWT = (token: any) => {
  return jwt.verify(token, authSecret);
};

const formatDate = (date: any) => {
  return moment(date).format(dateTimeFormat);
};

const randPassword = (letters: number, numbers: number, symbol: number) => {
  const chars = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", // letters
    "0123456789", // numbers
    "<>?!@#$%^&*()_+", // symbol
  ];

  return [letters, numbers, symbol]
    .map(function(len, i) {
      return Array(len)
        .fill(chars[i])
        .map(function(x) {
          return x[Math.floor(Math.random() * x.length)];
        })
        .join("");
    })
    .concat()
    .join("")
    .split("")
    .sort(function() {
      return 0.5 - Math.random();
    })
    .join("");
};

export {
  formatDate,
  handleErrorResponse,
  handleResponse,
  checkRequireField,
  passwordHashWithSalt,
  verifyPassword,
  randPassword,
  signJwt,
  decodeJWT,
};
