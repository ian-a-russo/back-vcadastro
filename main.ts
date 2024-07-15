import { NextFunction, Request, Response } from "express";
import { pool } from "./src/database/bancoDeDados";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(bodyParser.json());

app.get("/users", async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM usuarios");
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter usuários:", err);
    res.status(500).json({ error: "Erro ao obter usuários" });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter usuários:", err);
    res.status(500).json({ error: "Erro ao obter usuários" });
  }
});

app.post("/users", async (req: Request, res: Response) => {
  const { nome, email, telefone } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, telefone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao adicionar usuário:", err);
    res.status(500).json({ error: "Erro ao adicionar usuário" });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;
  try {
    const result = await pool.query(
      "UPDATE usuarios SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *",
      [nome, email, telefone, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.listen(() => {
  console.log(`Servidor rodando em https://vcadastro.vercel.app/`);
});
