import { createClient, InArgs } from "@libsql/client";

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

  // src/lib/db.ts -> Innerhalb des "if (dbType === "mysql")" Blocks
  db = {
    async execute(options) {
      let sql = typeof options === "string" ? options : options.sql;

      // Typsichere Deklaration der Argumente ohne any
      const args: (string | number | boolean | null)[] =
        typeof options === "string"
          ? []
          : (options.args as (string | number | boolean | null)[]) || [];

      if (sql.includes("AUTOINCREMENT")) {
        sql = sql.replace("AUTOINCREMENT", "AUTO_INCREMENT");
      }

      // Initialisiert die globale Variable 'pool', falls noch nicht geschehen
      await getPool();

      // Wir nutzen AUSSCHLIESSLICH die globale Variable 'pool'
      const [result] = await pool!.execute(sql, args);

      // Prüfung auf Schreiboperation (ResultSetHeader statt Zeilen-Array)
      if (!Array.isArray(result)) {
        return { rows: [] };
      }

      // Wenn es ein Array ist (SELECT), mappen wir es typsicher
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

      // Typsicherer Cast auf das von LibSQL erwartete Interface statt 'any'
      const args = (
        typeof options === "string" ? [] : options.args || []
      ) as InArgs;

      const result = await client.execute({
        sql,
        args, // Passt jetzt perfekt, da als InArgs deklariert
      });

      // LibSQL Reihen sauber mappen
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
