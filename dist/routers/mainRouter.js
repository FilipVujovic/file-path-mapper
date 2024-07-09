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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const mainService_1 = require("../service/mainService");
exports.router = express_1.default.Router();
exports.router.get('/api/files', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.domains) {
            const response = yield (0, mainService_1.RequestMapper)(req.body.domains);
            res.status(200).json(response);
        }
        else {
            const response = yield (0, mainService_1.RequestMapper)();
            res.status(200).json(response);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}));