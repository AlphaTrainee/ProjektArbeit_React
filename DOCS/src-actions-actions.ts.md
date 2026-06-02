# Datei: `src/actions/actions.ts`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei enthält die zentralen **Next.js Server Actions** für die Notizen-Verwaltung. Sie steuert die gesamte serverseitige Geschäftslogik für die CRUD-Operationen (Erstellen, Aktualisieren, Löschen) direkt aus Formularen heraus. Sie validiert die Formulardaten, kommuniziert mit der Datenbank und sorgt für die Aktualisierung des clientseitigen Caches (Revalidation).

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Typdefinition: `ActionState`

Definiert die standardisierte Rückgabestruktur für alle Actions, um Fehler- und Validierungsmeldungen an die Benutzeroberfläche (UI) zurückzugeben.

- **`success`**: Status, ob die Operation erfolgreich war (`boolean`).
- **`error`**: Allgemeine Fehlermeldung, z. B. bei Datenbankfehlern (`string | null`).
- **`fieldErrors`**: Ein nach Feldern (`title`, `content`, `category`) aufgetrenntes Array von Validierungsfehlern für eine präzise Anzeige direkt am Eingabefeld.

### 2. Funktion: `createNoteAction`

- **Aufgabe**: Erstellt eine neue Notiz in der Datenbank.
- **Ablauf**:
  1. Liest die Formulardaten ein und validiert sie über das Zod-Schema `NoteFormSchema`.
  2. Bei Validierungsfehlern werden die spezifischen Feldfehler gesammelt und an die UI zurückgegeben.
  3. Führt ein `INSERT INTO notes`-SQL-Query über das zentrale DB-Modul aus.
  4. Löscht den Cache für das Dashboard (`/`) und die Übersicht (`/notizen`), damit neue Daten sofort sichtbar sind (`revalidatePath`).
  5. Leitet den Benutzer zur Ziel-URL (`returnUrl`) weiter.

### 3. Funktion: `updateNoteAction`

- **Aufgabe**: Aktualisiert eine bestehende Notiz.
- **Ablauf**:
  1. Extrahiert die Daten, konvertiert die Notiz-ID explizit in eine Zahl (`Number`) und validiert das Gesamtelement gegen `noteSchema`.
  2. Führt bei erfolgreicher Validierung ein `UPDATE notes SET ... WHERE id = ?` aus.
  3. Bereinigt den Seiten-Cache und führt einen Redirect aus.

### 4. Funktion: `deleteNoteAction`

- **Aufgabe**: Löscht eine Notiz anhand ihrer ID.
- **Ablauf**:
  1. Extrahiert die ID aus dem Formular und prüft sie auf Gültigkeit (`isNaN`).
  2. Führt ein `DELETE FROM notes WHERE id = ?` aus.
  3. Stößt die Cache-Aktualisierung an und leitet den Benutzer um.
