"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = exports.db = void 0;
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
Object.defineProperty(exports, "Prisma", { enumerable: true, get: function () { return client_2.Prisma; } });
const db = new client_1.PrismaClient();
exports.db = db;
