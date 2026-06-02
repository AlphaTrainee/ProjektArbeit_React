# Datei: `src/db/init.ts`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei dient als **Initialisierungs- und Datenbank-Seeding-Skript**. Es wird typischerweise manuell über die Kommandozeile ausgeführt, um die Datenbankstruktur (die Tabelle `notes`) anzulegen. Zudem besitzt das Skript eine Weiche für verschiedene Datenbanksysteme (SQLite/MySQL), befüllt die Anwendung beim ersten Start mit vordefinierten Testdatensätzen (Seed-Daten) und bietet die Option, bestehende Tabellen komplett zurückzusetzen.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Funktion: `main` (Asynchrones Hauptskript)

- **Aufgabe**: Steuert den gesamten Ablauf der Datenbank-Initialisierung.
- **Ablauf**:
  1. **Optionale Tabellen-Löschung**: Prüft über die Node.js-Umgebungsvariable `process.argv`, ob das Skript mit dem Zusatzparameter `--reset` aufgerufen wurde. Wenn ja, wird die bestehende Tabelle mittels `DROP TABLE IF EXISTS notes` unwiderruflich gelöscht.
  2. **Datenbankunabhängige Tabellenerstellung**: Definiert das SQL-Statement `CREATE TABLE IF NOT EXISTS notes` mit den Kernspalten `id`, `title`, `content` und `category`.
  3. **SQL-Syntax-Korrektur (Dialekt-Weiche)**: Da SQLite das Schlüsselwort `AUTOINCREMENT` erwartet, MySQL jedoch das leicht abweichende `AUTO_INCREMENT` verlangt, prüft das Skript die Umgebungsvariable `process.env.DB_TYPE`. Steht diese auf `"mysql"`, wird der String dynamisch per `.replace()` korrigiert, um Syntaxfehler auf dem Server zu verhindern.
  4. **Ausführung**: Schickt den finalen SQL-String an die Datenbank.
  5. **Seeding (Testdaten einspielen)**: Iteriert über ein lokales Array (`samplenotes`), welches 10 strukturierte Beispiel-Notizen (mit Titeln, Inhalten und Kategorien wie Arbeit, Privat, Studium) enthält. Mittels einer `for...of`-Schleife und parametrisierten SQL-Abfragen (`INSERT INTO`) werden die Daten sicher eingepflegt.
  6. **Ressourcen-Bereinigung**: Schließt die Datenbankverbindung am Ende sauber über `await db.close()`, damit der Node-Prozess beendet wird und das Terminal freigegeben wird.

### 2. Fehlerbehandlung (`Catch`-Block)

- **Aufgabe**: Fängt unerwartete Abstürze (z. B. falsche Verbindungsdaten oder Berechtigungsprobleme) während der Initialisierung ab.
- **Ablauf**: Gibt den Fehler im Terminal aus, versucht im `try...catch`-Sicherheitsnetz verbleibende Datenbankverbindungen zu kappen und beendet den Prozess mit dem Fehlercode `1` (`process.exit(1)`).
