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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaMaxMinConsumo = exports.updateConsumo = exports.getConsumoAnual = exports.getConsumoTelefonos = exports.getConsumoClientes = exports.deleteConsumo = exports.crearConsumo = exports.getConsumoById = exports.getAllConsumo = void 0;
const consumoService_1 = require("../service/consumoService");
const clienteService_1 = require("../service/clienteService");
function getAllConsumo(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const consumos = yield (0, consumoService_1.getAllConsumoService)();
            res.status(200).json(consumos); // Retorna todos los consumos encontrados
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
}
exports.getAllConsumo = getAllConsumo;
function getConsumoById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.id);
            const consumo = yield (0, consumoService_1.getConsumoByIdService)(id);
            if (!consumo) {
                res.status(404).json({ error: 'Consumo no encontrado' });
            }
            else {
                res.status(200).json(consumo);
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
}
exports.getConsumoById = getConsumoById;
function crearConsumo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nuevoConsumo = req.body;
            if (!nuevoConsumo) {
                res.status(400).json({ error: 'Campos requeridos faltantes' });
            }
            else {
                const newConsumo = yield (0, consumoService_1.createConsumoService)(nuevoConsumo);
                res.status(200).json(newConsumo);
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
}
exports.crearConsumo = crearConsumo;
function deleteConsumo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            if (!id) {
                res.status(400).json({ error: 'Campos requeridos faltantes' });
            }
            else {
                const deleteConsumo = yield (0, consumoService_1.deleteConsumoService)(id);
                res.status(200).json(deleteConsumo);
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
}
exports.deleteConsumo = deleteConsumo;
function getConsumoTelefonos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_telefono = parseInt(req.params.telefono);
            if (!id_telefono) {
                res.status(400).json({ error: 'Campos requeridos faltantes' });
            }
            else {
                const consumos = yield (0, consumoService_1.getConsumoByTelefonoService)(id_telefono);
                res.status(200).json(consumos);
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
}
exports.getConsumoTelefonos = getConsumoTelefonos;
function getConsumoClientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_cliente = parseInt(req.params.cliente);
            if (!id_cliente) {
                res.status(400).json({ error: 'Campos requeridos faltantes' });
            }
            else {
                const telefonosCliente = yield (0, clienteService_1.getTelefonosService)(id_cliente); //obtengo los telefonos
                //por carada telefono obtengo los consumos
                let consumos = [];
                for (const telefono of telefonosCliente) {
                    const consumo = yield (0, consumoService_1.getConsumoByTelefonoService)(telefono.id);
                    consumos.push(consumo); // Usar push para agregar elementos a un array
                }
                res.status(200).json(consumos);
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
}
exports.getConsumoClientes = getConsumoClientes;
function getConsumoAnual(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { year, id_telefono } = req.body;
            if (!year || !id_telefono) {
                res.status(400).json({ error: 'La fecha es un campo requerido' });
            }
            else {
                // Lógica para obtener el consumo para la fecha especificada.
                const consumo = yield (0, consumoService_1.getConsumoPorYearService)(year, id_telefono);
                // const consumo = await getAllConsumoService();
                res.status(200).json(consumo);
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.getConsumoAnual = getConsumoAnual;
function updateConsumo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const consumoActualizado = req.body;
            // Verifica si el consumo existe
            const consumoExistente = yield (0, consumoService_1.getConsumoByIdService)(consumoActualizado.id);
            if (!consumoExistente) {
                res.status(404).json({ error: 'Consumo no encontrado' });
            }
            else {
                // Actualiza el consumo
                const updatedConsumo = yield (0, consumoService_1.updateConsumoService)(consumoActualizado);
                res.status(200).json(updatedConsumo); // Devuelve el cliente actualizado como respuesta JSON
            }
        }
        catch (error) {
            console.error('Error al editar el consumo:', error);
            res.status(500).json({ error: 'Error al editar el consumo' });
        }
    });
}
exports.updateConsumo = updateConsumo;
function getMediaMaxMinConsumo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_telefono = parseInt(req.params.telefono);
            const mediaMaxMinConsumo = yield (0, consumoService_1.getMediaMaxMinConsumoService)(id_telefono);
            res.status(200).json(mediaMaxMinConsumo);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    });
}
exports.getMediaMaxMinConsumo = getMediaMaxMinConsumo;
