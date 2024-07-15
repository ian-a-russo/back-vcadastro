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
const bancoDeDados_1 = require("./src/database/bancoDeDados");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://vcadastro.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(body_parser_1.default.json());
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield bancoDeDados_1.pool.connect();
        const result = yield client.query("SELECT * FROM usuarios");
        client.release();
        res.json(result.rows);
    }
    catch (err) {
        console.error("Erro ao obter usuários:", err);
        res.status(500).json({ error: "Erro ao obter usuários" });
    }
}));
app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const client = yield bancoDeDados_1.pool.connect();
        const result = yield client.query("SELECT * FROM usuarios WHERE id = $1", [
            id,
        ]);
        client.release();
        res.json(result.rows);
    }
    catch (err) {
        console.error("Erro ao obter usuários:", err);
        res.status(500).json({ error: "Erro ao obter usuários" });
    }
}));
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, telefone } = req.body;
    try {
        const result = yield bancoDeDados_1.pool.query("INSERT INTO usuarios (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *", [nome, email, telefone]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error("Erro ao adicionar usuário:", err);
        res.status(500).json({ error: "Erro ao adicionar usuário" });
    }
}));
app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield bancoDeDados_1.pool.query("DELETE FROM usuarios WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error("Erro ao deletar usuário:", err);
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
}));
app.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;
    try {
        const result = yield bancoDeDados_1.pool.query("UPDATE usuarios SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *", [nome, email, telefone, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
}));
app.listen(PORT, () => {
    console.log(`Servidor rodando em https://back-vcadastro.vercel.app:${PORT}`);
});
