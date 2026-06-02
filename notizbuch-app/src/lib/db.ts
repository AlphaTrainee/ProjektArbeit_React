import { createClient } from "@libsql/client";

// Typsichere Struktur für eine Datenbankzeile
export interface DBRow {
  id: string | number;
  title: string;
  content: string;
  category: string;
  [key: string]: unknown; // Erlaubt zusätzliche Spalten typsicher über unknown
}

export interface DBResult {
  rows: DBRow[];
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
  // Wir importieren den echten Typ für den Pool aus mysql2
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
      const args = typeof options === "string" ? [] : options.args || [];

      if (sql.includes("AUTOINCREMENT")) {
        sql = sql.replace("AUTOINCREMENT", "AUTO_INCREMENT");
      }

      const currentPool = await getPool();
      const [rows] = await currentPool.execute(sql, args);

      // Die Zeilen werden über unknown sicher in unser DBRow-Format überführt
      const formattedRows = (rows as Record<string, unknown>[]).map((row) => ({
        id: String(row.id),
        title: String(row.title),
        content: String(row.content),
        category: String(row.category),
        ...row,
      }));

      return { rows: formattedRows };
    },

    async close() {
      if (pool) {
        await pool.end();
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
      const result = await client.execute(options);

      // LibSQL Reihen sauber mappen ohne unsaubere Typen-Tricks
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
