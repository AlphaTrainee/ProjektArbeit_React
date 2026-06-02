import { db } from "@/lib/db";

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

  // 10 Beispiel-Datensätze (Seed-Daten)
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
    {
      title: "Next.js Lernziele",
      content:
        "Server Actions verstehen, Routing vertiefen und API-Routen optimieren.",
      category: "Studium",
    },
    {
      title: "Projektidee: Notiz-App",
      content:
        "Dashboard mit Kategorien-Filter, Suchfunktion und responsivem Layout entwickeln.",
      category: "Arbeit",
    },
    {
      title: "Wichtige Passwörter & Logins",
      content:
        "Keine echten Passwörter hier speichern! Nur ein Reminder für den Passwort-Manager.",
      category: "Privat",
    },
    {
      title: "Git Befehle Spickzettel",
      content:
        "git commit -m 'message', git push origin main, git pull --rebase.",
      category: "Studium",
    },
    {
      title: "Urlaubsplanung 2026",
      content:
        "Flüge vergleichen, Unterkunft buchen und Reiseapotheke überprüfen.",
      category: "Privat",
    },
    {
      title: "Datenbank-Design",
      content:
        "Primärschlüssel setzen, Datentypen für SQLite und MySQL kompatibel halten.",
      category: "Arbeit",
    },
    {
      title: "Sport-Trainingsplan",
      content:
        "Montag: Laufen, Mittwoch: Krafttraining, Freitag: Dehnen und Regeneration.",
      category: "Privat",
    },
    {
      title: "React Hooks Zusammenfassung",
      content:
        "useState für lokalen State, useEffect für Side-Effects, useContext für globalen State.",
      category: "Studium",
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
