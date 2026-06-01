import { db } from "../lib/db";

async function main() {
  const shouldReset = process.argv.includes("--reset");

  if (shouldReset) {
    await db.execute("DROP TABLE IF EXISTS notes");
    console.log("Option --reset aktiv: Alte Tabelle 'notes' wurde gelöscht.");
  }

  // Tabelle erstellen mit deinen Spalten und dem AUTOINCREMENT-Switch für MySQL
  let createTableSql = `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL
      );
  `;

  // SQLite nutzt "AUTOINCREMENT", MySQL verlangt "AUTO_INCREMENT"
  if (
    process.env.DB_TYPE === "mysql" &&
    createTableSql.includes("AUTOINCREMENT")
  ) {
    createTableSql = createTableSql.replace("AUTOINCREMENT", "AUTO_INCREMENT");
  }

  await db.execute(createTableSql);
  console.log("Tabelle 'notes' wurde geprüft/erstellt.");

  // 3 Beispiel-Datensätze (Seed-Daten)
  const samplenotes = [
    {
      title: "Erste Notiz",
      content: "Das ist der Inhalt meiner allerersten Notiz.",
      category: "Arbeit",
    },
    {
      title: "Einkaufsliste",
      content: "Milch, Brot, Kaffee für die Projektarbeit.",
      category: "Privat",
    },
  ];

  // Daten über die zentrale Engine einfügen
  for (const form of samplenotes) {
    await db.execute({
      sql: "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)",
      args: [form.title, form.content, form.category],
    });
  }

  console.log("Beispiel-Daten erfolgreich gespeichert!");

  // Verbindung trennen, damit Node das Terminal freigibt
  await db.close();
}

main().catch(async (err) => {
  console.error("Fehler beim Seeding der notes-Tabelle:", err);
  try {
    await db.close();
  } catch (_) {}
  process.exit(1);
});
