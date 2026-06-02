# Datei: `src/types/note.ts`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei dient der **zentralen Typdefinition und Datenvalidierung** für Notiz-Objekte im System. Sie nutzt _Zod_, um ein striktes Laufzeit-Schema zu definieren, leitet daraus die statischen TypeScript-Typen ab und stellt ein separates Schema für Formulare bereit. Dadurch wird sichergestellt, dass im gesamten Datenfluss (von der Datenbank über die Server Actions bis hin zu den UI-Komponenten) einheitliche Typen verwendet werden.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Laufzeit-Schema: `NoteSchema`

Ein Zod-Objekt (`z.object`), das ein vollständiges, valides Notiz-Objekt repräsentiert, wie es aus der Datenbank gelesen wird.

- **`id`**: Muss zwingend eine Zahl sein (`z.number()`).
- **`title`**: Muss ein String sein und mindestens 1 Zeichen enthalten. Fehlermeldung: _"Der Titel darf nicht leer sein"_.
- **`content`**: Muss ein String sein und mindestens 1 Zeichen enthalten. Fehlermeldung: _"Der Inhalt darf nicht leer sein"_.
- **`category`**: Muss ein String sein und mindestens 1 Zeichen enthalten. Fehlermeldung: _"Die Kategorie darf nicht leer sein"_.

### 2. Statischer TypeScript-Typ: `Note`

- **Aufgabe**: Generiert den nativen TypeScript-Typen automatisch aus dem Zod-Schema.
- **Mechanismus**: Nutzt `z.infer<typeof NoteSchema>`. Dies verhindert redundanten Code (DRY-Prinzip – _Don't Repeat Yourself_), da Änderungen am `NoteSchema` sofort automatisch auf den TypeScript-Typen `Note` übertragen werden.

### 3. Formular-Schema: `NoteFormSchema`

- **Aufgabe**: Ein spezielles Teilschema für Erstellungs-Formulare.
- **Mechanismus**: Nutzt die Zod-Methode `.omit({ id: true })`. Dadurch werden alle Validierungsregeln von `NoteSchema` für Titel, Inhalt und Kategorie eins-zu-eins übernommen, aber das Feld `id` wird explizit ausgeschlossen (da eine neue Notiz beim Absenden des Formulars noch keine Datenbank-ID besitzt).
