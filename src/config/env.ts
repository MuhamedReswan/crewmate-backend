import exp from "constants";
import dotenv from "dotenv";
dotenv.config();

export const MONGODBURL = process.env.MONGODBURL
export const PORT = process.env.PORT
export const REDISURL = process.env.REDISURL
export const CLIENTURL = process.env.CLIENTURL
export const NODEMAILERPASSWORD = process.env.NODEMAILERPASSWORD
export const NODEMAILEREMAIL = process.env.NODEMAILEREMAIL
export const ACCESSTOKENSECRET = process.env.ACCESSTOKENSECRET
export const REFRESHTOKENSECRET = process.env.REFRESHTOKENSECRET
export const NODE_ENV  = process.env.NODEENV
