# Datei: `src/components/NoteCard.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Client-Komponente ist für die **visuelle Darstellung einer einzelnen Notiz** (als Karte/Card) zuständig. Neben der Anzeige von Kategorie, Titel und Inhalt stellt sie direkt auf der Karte zwei Interaktionsmöglichkeiten bereit: Einen Link zum Bearbeiten-Fenster sowie ein autarkes Formular inklusive Sicherheitsabfrage, um die Notiz direkt zu löschen.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Typdefinition: `NoteCardProps`

Definiert die Struktur des übergebenen Notiz-Objekts.

- **`note`**: Enthält die eindeutige ID, den Titel, den Inhalt sowie die zugehörige Kategorie der Notiz.

### 2. Zustand & Server Action: `useActionState`

Die Komponente nutzt den React-Hook `useActionState`, um die Lösch-Aktion asynchron und sicher zu verarbeiten.

- **`deleteNoteAction`**: Die serverseitige Funktion, die beim Absenden des Formulars ausgeführt wird.
- **`state`**: Enthält den aktuellen Rückgabestatus (Erfolg oder Fehlermeldung) der Server Action.
- **`formAction`**: Die modifizierte Aktion, die an das `<form>`-Attribut übergeben wird.
- **`isPending`**: Ein Status-Inhaltsindikator (`boolean`), der signalisiert, ob der Löschvorgang in der Datenbank aktuell noch läuft.

### 3. Funktion: `handleDeleteSubmit`

- **Aufgabe**: Eine clientseitige Sicherheitsbarriere vor dem endgültigen Löschen.
- **Ablauf**:
  1. Klickt der Nutzer auf "Löschen", öffnet sich ein natives Bestätigungsfenster des Browsers (`window.confirm`).
  2. Wählt der Nutzer "Abbrechen", wird über `event.preventDefault()` das Absenden des Formulars blockiert und die Server Action gar nicht erst getriggert.

### 4. Aufbau der Benutzeroberfläche (UI)

- **Inhalt**: Gibt die Kategorie als Badge sowie den Titel und den Inhalt aus. Dank der Tailwind-Klasse `whitespace-pre-wrap` bleiben Zeilenumbrüche im Text der Notiz originalgetreu erhalten.
- **Fehlermeldung**: Tritt beim Löschen ein Datenbankfehler auf, wird dieser über `{state.error}` als rotes Warnbanner eingeblendet.
- **Aktionen**:
  - **Bearbeiten-Button**: Ein `<Link>`, der den Benutzer auf die dynamische Bearbeitungsseite (`/notizen/[id]/bearbeiten`) weiterleitet.
  - **Lösch-Formular**: Ein kompaktes Inline-Formular, das die ID der Notiz über ein unsichtbares Feld (`<input type="hidden" />`) mitsendet. Der Submit-Button wird während des Löschvorgangs (`isPending`) deaktiviert, um Mehrfachklicks zu verhindern.
