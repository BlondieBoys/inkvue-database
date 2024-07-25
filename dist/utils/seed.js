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
const chance_1 = __importDefault(require("chance"));
const logger_1 = require("./logger");
const mongodb_1 = require("mongodb");
const prisma_1 = require("../prisma/prisma");
const chance = new chance_1.default();
const createUser = () => {
    return {
        id: new mongodb_1.ObjectId().toHexString(),
        email: chance.email(),
        firstName: chance.name(),
        lastName: chance.name(),
    };
};
const generateUsers = () => {
    return chance.n(createUser, chance.integer({ min: 2, max: 5 }));
};
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = generateUsers();
    try {
        yield prisma_1.prisma.user.createMany({
            data: users,
        });
        logger_1.logger.info("Successfully seeded database");
    }
    catch (e) {
        logger_1.logger.error(`An Error occurred when attempting to seed db: ${e}`);
    }
});
seed();
