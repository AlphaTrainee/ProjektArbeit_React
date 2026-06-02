# Datei: `src/data/schema.ts`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei definiert das zentrale **Validierungsschema für Notiz-Datensätze** mithilfe der Bibliothek _Zod_. Es stellt sicher, dass die von Benutzern eingegebenen Daten sowohl clientseitig im Formular als auch serverseitig vor dem Datenbankzugriff exakt den definierten Typregeln und Qualitätskriterien entsprechen. Durch die zentral hinterlegten Fehlermeldungen wird eine einheitliche Sprachausgabe in der gesamten Anwendung garantiert.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Validierungsobjekt: `noteSchema`

Ein exportiertes Zod-Objekt (`z.object`), das die Struktur und die Validierungsregeln für ein Notiz-Formulardatensatz festlegt. Folgende Felder werden überprüft:

- **`id`**:
  - Typ: Zeichenkette (`z.string()`)
  - Bedingung: Optional (`.optional()`)
  - _Hintergrund_: Dieses Feld ist beim Erstellen einer neuen Notiz leer, wird jedoch beim Editieren benötigt, um den bestehenden Datensatz in der Datenbank eindeutig zu identifizieren.

- **`title`**:
  - Typ: Zeichenkette (`z.string()`)
  - Bedingung 1: Mindestens 1 Zeichen (`.min(1)`). Falls das Feld leer gelassen wird, wird die Fehlermeldung _"Bitte gib einen Titel an."_ ausgegeben.
  - Bedingung 2: Maximal 100 Zeichen (`.max(100)`). Verhindert zu lange Überschriften, die das UI-Layout zerstören könnten, mit der Meldung _"Der Titel darf maximal 100 Zeichen lang sein."_

- **`content`**:
  - Typ: Zeichenkette (`z.string()`)
  - Bedingung: Mindestens 1 Zeichen (`.min(1)`). Verhindert das Abspeichern komplett leerer Notizen und gibt im Fehlerfall _"Der Inhalt darf nicht leer sein."_ zurück.

- **`category`**:
  - Typ: Zeichenkette (`z.string()`)
  - Bedingung: Mindestens 1 Zeichen (`.min(1)`). Erzwingt, dass der Benutzer eine der vorgegebenen Kategorien (wie Arbeit, Privat, Idee) im Auswahlmenü selektiert. Andernfalls erscheint _"Bitte wähle eine Kategorie aus."_
