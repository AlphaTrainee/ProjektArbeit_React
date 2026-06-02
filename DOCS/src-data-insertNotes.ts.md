# Datei: `src/data/insertNotes.ts`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei stellt eine universelle **Server Action namens `insertNote`** bereit, die als zentrales Bindeglied für das Formular `<NoteForm />` fungiert. Sie bündelt die serverseitige Validierung über Zod und entscheidet dynamisch anhand der übergebenen Daten, ob ein Datensatz neu angelegt (`INSERT`) oder aktualisiert (`UPDATE`) wird. Zudem steuert sie nach erfolgreichem Abschluss eine variable Weiterleitung des Benutzers.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Typdefinitionen für das Zustandsmanagement

- **`FieldErrors`**: Ein strukturiertes Objekt, das Validierungsfehler exakt den Feldern `title`, `content` oder `category` zuordnet.
- **`ActionState`**: Definiert das Zustands-Interface für den Kommunikationskanal zwischen Server und Client-Formular. Es speichert den Erfolgsstatus (`result`), Systemfehler (`error`), die gesendeten Rohdaten (`formData`) sowie die feldbezogenen Fehler (`errors`).

### 2. Hauptfunktion: `insertNote` (Server Action)

- **Aufgabe**: Validiert Formulardaten und führt die entsprechende Schreiboperation (Create/Update) in der Datenbank aus.
- **Ablauf**:
  1. **Datenkonvertierung & Validierung**: Wandelt das empfangene `FormData`-Objekt über `Object.fromEntries` in ein Standard-JavaScript-Objekt um und prüft es mittels `noteSchema.safeParse()` gegen die Zod-Regeln.
  2. **Fehlerbehandlung bei Validierung**: Schlägt die Validierung fehl, wird das `formatZodErrors`-Hilfswerkzeug aufgerufen. Die Action bricht ab und sendet den Fehlerzustand inklusive der ursprünglichen Eingabedaten zurück an den Client.
  3. **Weichenstellung (Insert vs. Update)**:
     - Existiert im validierten Datensatz bereits eine `id`, schaltet die Funktion in den _Bearbeiten-Modus_ und führt ein SQL-`UPDATE` aus.
     - Ist keine `id` vorhanden, läuft sie im _Neu-Modus_ und setzt ein SQL-`INSERT INTO` ab.
  4. **Dynamische Weiterleitung (Redirect)**: Extrahiert das versteckte Feld `redirectTo` aus den Formulardaten. War die Datenbankoperation erfolgreich, bricht Next.js die Funktion wie vorgesehen ab und leitet den Benutzer über `redirect(targetUrl)` zur Ursprungsseite (z. B. inklusive Suchparameter oder Filter) oder standardmäßig auf das Dashboard (`/`) zurück.

### 3. Hilfsfunktion: `formatZodErrors`

- **Aufgabe**: Übersetzt die verschachtelte Fehlermatrix von Zod in ein flaches, leicht lesbares Format.
- **Ablauf**: Iteriert über das Array der Zod-Fehlermeldungen (`error.issues`), filtert die betroffenen Felder (`title`, `content`, `category`) heraus und ordnet ihnen die jeweilige Fehlermeldung im `FieldErrors`-Format zu.
