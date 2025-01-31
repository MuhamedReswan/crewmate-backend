"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.REFRESHTOKENSECRET = exports.ACCESSTOKENSECRET = exports.NODEMAILEREMAIL = exports.NODEMAILERPASSWORD = exports.CLIENTURL = exports.REDISURL = exports.PORT = exports.MONGODBURL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.MONGODBURL = process.env.MONGODBURL;
exports.PORT = process.env.PORT;
exports.REDISURL = process.env.REDISURL;
exports.CLIENTURL = process.env.CLIENTURL;
exports.NODEMAILERPASSWORD = process.env.NODEMAILERPASSWORD;
exports.NODEMAILEREMAIL = process.env.NODEMAILEREMAIL;
exports.ACCESSTOKENSECRET = process.env.ACCESSTOKENSECRET;
exports.REFRESHTOKENSECRET = process.env.REFRESHTOKENSECRET;
exports.NODE_ENV = process.env.NODEENV;
