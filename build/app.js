"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clienteRoutes_1 = __importDefault(require("./routes/clienteRoutes"));
const tlfRoutes_1 = __importDefault(require("./routes/tlfRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/', clienteRoutes_1.default);
app.use('/', tlfRoutes_1.default);
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
