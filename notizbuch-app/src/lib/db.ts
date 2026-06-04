import { createClient, InArgs } from "@libsql/client";

export interface DBRow {
  id: string | number;
  title: string;
  content: string;
  category: string;
  [key: string]: unknown;
}

// HIER ERWEITERT: Optionale insertId im Rückgabetyp deklarieren
export interface DBResult {
  rows: DBRow[];
  insertId?: string | number;
}

interface UniversalDB {
  execute: (
    options: string | { sql: string; args?: unknown[] },
  ) => Promise<DBResult>;
  close: () => Promise<void>;
}

const dbType = process.env.DB_TYPE || "libsql";
let db: UniversalDB;

if (dbType === "mysql") {
  let pool: import("mysql2/promise").Pool | null = null;

  const getPool = async () => {
    if (!pool) {
      const mysql = await import("mysql2/promise");
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
      });
    }
    return pool;
  };

  db = {
    async execute(options) {
      let sql = typeof options === "string" ? options : options.sql;

      const args: (string | number | boolean | null)[] =
        typeof options === "string"
          ? []
          : (options.args as (string | number | boolean | null)[]) || [];

      if (sql.includes("AUTOINCREMENT")) {
        sql = sql.replace("AUTOINCREMENT", "AUTO_INCREMENT");
      }

      await getPool();
      const [result] = await pool!.execute(sql, args);

      // MySQL Schreiboperation: Result ist ResultSetHeader (kein Array)
      if (!Array.isArray(result)) {
        const header = result as { insertId?: number | string };
        return {
          rows: [],
          insertId: header.insertId, // ID für MySQL mitsenden
        };
      }

      const formattedRows = (result as Record<string, unknown>[]).map(
        (row) => ({
          id: String(row.id ?? ""),
          title: String(row.title ?? ""),
          content: String(row.content ?? ""),
          category: String(row.category ?? ""),
          ...row,
        }),
      );

      return { rows: formattedRows };
    },

    async close() {
      if (pool) {
        await pool.end();
        pool = null;
      }
    },
  };

  console.log("Zentrale DB-Engine auf MYSQL/MARIADB umgestellt.");
} else {
  const client = createClient({
    url: process.env.DB_URL || "file:src/data/blog.db",
  });

  db = {
    async execute(options) {
      const sql = typeof options === "string" ? options : options.sql;
      const args = (
        typeof options === "string" ? [] : options.args || []
      ) as InArgs;

      const result = await client.execute({
        sql,
        args,
      });

      // LibSQL Schreiboperation: Überprüfen, ob lastInsertRowid existiert
      if (result.lastInsertRowid !== undefined) {
        return {
          rows: [],
          insertId: result.lastInsertRowid.toString(), // ID für LibSQL mitsenden
        };
      }

      const formattedRows = result.rows.map((row) => ({
        id: String(row.id ?? ""),
        title: String(row.title ?? ""),
        content: String(row.content ?? ""),
        category: String(row.category ?? ""),
        ...row,
      }));

      return { rows: formattedRows };
    },
    async close() {},
  };

  console.log("Zentrale DB-Engine auf LIBSQL/SQLITE umgestellt.");
}

export { db };
