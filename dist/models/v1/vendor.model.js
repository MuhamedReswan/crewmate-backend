"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorModel = void 0;
const mongoose_1 = require("mongoose");
const location_model_1 = require("./location.model");
const Role_1 = require("../../constants/Role");
const status_1 = require("../../constants/status");
const vendorSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    isVerified: { type: String, default: status_1.VerificationStatus.Pending },
    rejectionReason: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
    profileImage: { type: String },
    password: { type: String },
    role: { type: String, default: Role_1.Role.VENDOR },
    estd: { type: String },
    instaId: { type: String },
    licenceNumber: { type: String },
    licenceImage: { type: String },
    location: {
        type: location_model_1.LocationSchema,
        required: false
    }
});
exports.vendorModel = (0, mongoose_1.model)('Vendors', vendorSchema);
