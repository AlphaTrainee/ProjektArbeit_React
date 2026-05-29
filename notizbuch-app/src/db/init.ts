import { db } from "./database";

async function initDB() {
  console.log("Starte Datenbank-Initialisierung...");

  try {
    // 1. Tabelle erstellen (falls sie noch nicht existiert)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL
      );
    `);
    console.log("Tabelle 'notes' wurde erfolgreich erstellt.");

    // 2. Prüfen, ob schon Daten da sind
    const existing = await db.execute("SELECT COUNT(*) as count FROM notes");
    const count = existing.rows[0].count as number;

    // 3. Nur Testdaten einfügen, wenn die Tabelle komplett leer ist
    if (count === 0) {
      await db.execute({
        sql: "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)",
        args: [
          "Erste Notiz",
          "Das ist der Inhalt meiner allerersten Notiz.",
          "Arbeit",
        ],
      });
      await db.execute({
        sql: "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)",
        args: [
          "Einkaufsliste",
          "Milch, Brot, Kaffee für die Projektarbeit.",
          "Privat",
        ],
      });
      console.log("Beispiel-Notizen wurden eingefügt.");
    } else {
      console.log("Datenbank enthält bereits Daten. Überspringe Testdaten.");
    }
  } catch (error) {
    console.error("Fehler bei der Datenbank-Initialisierung:", error);
  }
}

initDB();
