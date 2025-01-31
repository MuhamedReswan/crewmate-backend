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
exports.BaseRepository = void 0;
const mongoose_1 = require("mongoose");
const tsyringe_1 = require("tsyringe");
let BaseRepository = class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdDocument = yield this.model.create(data);
                return createdDocument;
            }
            catch (error) {
                console.error("Error creating document:", error);
                throw error;
            }
        });
    }
    ;
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield this.model.findOne(filter).exec();
                return document;
            }
            catch (error) {
                console.error("Error finding document:", error);
                throw error;
            }
        });
    }
    ;
    updateOne(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDocument = yield this.model.findOneAndUpdate(filter, updateData, { new: true }).exec();
                return updatedDocument;
            }
            catch (error) {
                console.error("Error updating document:", error);
                throw error;
            }
        });
    }
    ;
    deleteOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedDocument = yield this.model.findOneAndDelete(filter).exec();
                return deletedDocument;
            }
            catch (error) {
                console.error("Error deleting document:", error);
                throw error;
            }
        });
    }
    ;
    deleteMany(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield this.model.deleteMany(filter).exec();
                return deleted.deletedCount || 0;
            }
            catch (error) {
                console.error("Error deleting many document:", error);
                throw error;
            }
            ;
        });
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [mongoose_1.Model])
], BaseRepository);
