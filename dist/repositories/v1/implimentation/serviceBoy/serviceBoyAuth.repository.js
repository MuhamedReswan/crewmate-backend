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
const tsyringe_1 = require("tsyringe");
const resposnseMessage_1 = require("../../../../constants/resposnseMessage");
const serviceBoy_model_1 = require("../../../../models/v1/serviceBoy.model");
const notFound_error_1 = require("../../../../utils/errors/notFound.error");
const mongoose_1 = require("mongoose");
const base_repository_1 = require("../base/base.repository");
let serviceBoyAuthRepository = class serviceBoyAuthRepository extends base_repository_1.BaseRepository {
    constructor(model) {
        super(model);
    }
    findServiceBoyByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.findOne({ email });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    ;
    createServiceBoy(serviceBoyData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("createServiceBoy got");
                console.log("serviceBoyData", serviceBoyData);
                // let serviceBoyDetails =  await serviceBoyModel.create(serviceBoyData);
                let serviceBoyDetails = yield this.create(serviceBoyData);
                console.log("serviceBoyDetails", serviceBoyDetails);
                return true;
            }
            catch (error) {
                console.log("error from createServiceBoy repository", error);
                throw error;
            }
        });
    }
    updateServiceBoyPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedServiceBoy = yield serviceBoy_model_1.serviceBoyModel.findOneAndUpdate({ email }, { password }, { new: true });
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
serviceBoyAuthRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ServiceBoyModel')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], serviceBoyAuthRepository);
exports.default = serviceBoyAuthRepository;
