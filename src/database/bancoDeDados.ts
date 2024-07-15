import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "usuarios",
  password: "120506",
  port: 5432,
});

export { pool };
