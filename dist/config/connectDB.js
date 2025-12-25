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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
// setting wage by admin
const systemSettings_model_1 = require("../models/v1/systemSettings.model");
function initializeSystemSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield systemSettings_model_1.SystemSettingsModel.findOne({});
        if (!settings) {
            yield systemSettings_model_1.SystemSettingsModel.create({
                wagePerBoy: 500,
                updatedAt: new Date()
            });
            console.log("Default system settings created");
        }
    });
}
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.MONGODBURL !== null && env_1.MONGODBURL !== void 0 ? env_1.MONGODBURL : "", {
            autoIndex: false
        });
        console.log("Database connected");
        yield initializeSystemSettings();
    }
    catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
