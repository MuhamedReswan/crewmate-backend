"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRedisData = exports.getRedisData = exports.setRedisData = void 0;
const redis_1 = require("redis");
const env_1 = require("../config/env");
const redisClient = (0, redis_1.createClient)({
    url: env_1.REDISURL,
});
redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});
redisClient.on("connect", () => {
    console.log("Connected to Redis event");
});
redisClient.connect().catch((err) => {
    console.log('Redis connection error:', err);
});
const setRedisData = (key, value, ttl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (ttl) {
            yield redisClient.setEx(key, ttl, value);
        }
        else {
            yield redisClient.set(key, value);
        }
        console.log(`Data for ${key} saved successfully`);
        return true;
    }
    catch (error) {
        console.error(`Error saving data for ${key}:`, error);
        return false;
    }
});
exports.setRedisData = setRedisData;
const getRedisData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield redisClient.get(key);
        return data;
    }
    catch (error) {
        console.error(`Error retrieving data for ${key}:`, error);
        return null;
    }
});
exports.getRedisData = getRedisData;
const deleteRedisData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.del(key);
        console.log(`Data for ${key} deleted successfully`);
    }
    catch (error) {
        console.error(`Error deleting data for ${key}:`, error);
    }
});
exports.deleteRedisData = deleteRedisData;
exports.default = redisClient;
