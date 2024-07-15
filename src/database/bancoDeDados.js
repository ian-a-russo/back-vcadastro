"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "usuarios",
    password: "120506",
    port: 5432,
});
exports.pool = pool;
