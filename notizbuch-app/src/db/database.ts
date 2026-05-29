import { createClient } from "@libsql/client";

// Erstellt eine lokale SQLite-Datei namens "local.db" im Hauptverzeichnis
export const db = createClient({
  url: "file:local.db",
});
