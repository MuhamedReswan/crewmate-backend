"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const resposnseMessage_1 = require("../../../../constants/resposnseMessage");
const vendor_model_1 = require("../../../../models/v1/vendor.model");
const notFound_error_1 = require("../../../../utils/errors/notFound.error");
const otp_util_1 = require("../../../../utils/otp.util");
const redis_util_1 = require("../../../../utils/redis.util");
const base_repository_1 = require("../base/base.repository");
const tsyringe_1 = require("tsyringe");
const mongoose_1 = require("mongoose");
let VendorAuthRepository = class VendorAuthRepository extends base_repository_1.BaseRepository {
    constructor(model) {
        super(model);
    }
    findVendorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield vendor_model_1.vendorModel.findOne({ email });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    ;
    createVendor(vendorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("vendor got");
                console.log("vendorData", vendorData);
                let vendorDetails = yield this.create(vendorData);
                console.log("vendorDetails from repo create", vendorDetails);
            }
            catch (error) {
                console.log("error from createServiceBoy repository", error);
                throw error;
            }
        });
    }
    ;
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, redis_util_1.deleteRedisData)(`otpV${email}`);
                const otp = (0, otp_util_1.createOtp)();
                yield (0, redis_util_1.setRedisData)(`otpV:${email}`, JSON.stringify({ otp }), 120);
                let savedOtp = yield (0, redis_util_1.getRedisData)(`otpV:${email}`);
                console.log("savedOtpV", savedOtp);
                yield (0, otp_util_1.sendOtpEmail)(email, otp);
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
    updateVendorPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedServiceBoy = this.updateOne({ email }, { password });
                if (!updatedServiceBoy) {
                    throw new notFound_error_1.NotFoundError(resposnseMessage_1.ResponseMessage.USER_NOT_FOUND);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
};
VendorAuthRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("VendorModel")),
    __metadata("design:paramtypes", [mongoose_1.Model])
], VendorAuthRepository);
exports.default = VendorAuthRepository;
