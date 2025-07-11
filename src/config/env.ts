import dotenv from "dotenv";
dotenv.config();

export const MONGODBURL = process.env.MONGODBURL!;
export const PORT = process.env.PORT || 3000;
export const REDISURL = process.env.REDISURL!;
export const CLIENTURL = process.env.CLIENTURL!;
export const NODEMAILERPASSWORD = process.env.NODEMAILERPASSWORD!;
export const NODEMAILEREMAIL = process.env.NODEMAILEREMAIL!;
export const ACCESSTOKENSECRET = process.env.ACCESSTOKENSECRET!;
export const REFRESHTOKENSECRET = process.env.REFRESHTOKENSECRET!;
export const NODE_ENV  = process.env.NODEENV;

export const ACCESS_TOKEN_MAX_AGE = Number(process.env.ACCESS_TOKEN_EXPIRES_IN_MINUTES) * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS) * 24 * 60 * 60 * 1000;
