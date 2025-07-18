"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceBoyModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Role_1 = require("../../constants/Role");
const location_model_1 = require("./location.model");
const UnAvailableSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    reason: { type: String, required: true },
});
const ServiceBoysSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    profileImage: { type: String },
    aadharNumber: { type: String, unique: true, sparse: true },
    aadharImageFront: { type: String },
    aadharImageBack: { type: String },
    age: { type: Number },
    qualification: { type: String },
    points: { type: Number, default: 0 },
    role: { type: String, default: Role_1.Role.SERVICE_BOY },
    date: { type: mongoose_1.Schema.Types.Date },
    password: { type: String },
    servicerId: { type: String, unique: true, sparse: true },
    walletId: { type: mongoose_1.Schema.Types.ObjectId, unique: true, sparse: true },
    workHistoryId: { type: mongoose_1.Schema.Types.ObjectId, unique: true, sparse: true },
    location: { type: location_model_1.LocationSchema, required: false },
    offDates: [UnAvailableSchema],
});
exports.serviceBoyModel = mongoose_1.default.model('ServiceBoys', ServiceBoysSchema);
