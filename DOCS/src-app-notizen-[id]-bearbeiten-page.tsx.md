# Datei: `src/app/notizen/[id]/bearbeiten/page.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei stellt die dynamische Server-Page zum **Bearbeiten einer bestehenden Notiz** bereit (Dynamic Route anhand der Notiz-ID). Sie liest die ID aus der URL, prüft die Herkunft des Benutzers für eine intelligente Rücksprung-Funktion, lädt die entsprechenden Daten aus der Datenbank und übergibt diese an das Bearbeitungsformular.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Typdefinition: `EditNotePageProps`

Definiert die Struktur der Props, die Next.js an dynamische Routen übergibt.

- **`params`**: Ein `Promise`, welches das dynamische URL-Segment (die `id` der Notiz als `string`) enthält.

### 2. Funktion: `EditNotePage` (Server Component)

- **Aufgabe**: Bereitet die Daten für das Bearbeiten einer Notiz serverseitig vor und rendert die Seite.
- **Ablauf**:
  1. Löst das `params`-Promise auf und konvertiert die ID in eine Ganzzahl (`parseInt`). Falls die ID keine gültige Zahl ist, wird sofort die Next.js-Standard-Fehlerseite (`notFound()`) ausgelöst.
  2. Liest über die Next.js `headers()` den HTTP-Referer (die vorherige Seite) aus. Daraus wird der exakte Pfad inklusive Suchparameter (`pathname + search`) extrahiert, um dem Benutzer nach dem Speichern oder Abbrechen eine Rückkehr zur exakt selben Ansicht (z. B. mit aktiven Filtern oder Suchbegriffen) zu ermöglichen.
  3. Führt eine SQL-Abfrage (`SELECT * FROM notes WHERE id = ?`) aus, um die Notiz aus der Datenbank zu laden.
  4. Wenn keine Notiz mit dieser ID existiert, wird ebenfalls die `notFound()`-Seite aufgerufen.
  5. Konvertiert die Datenbank-Zeile typsicher in ein standardisiertes Notiz-Objekt.
  6. Rendert die Ansicht und übergibt die geladenen Daten sowie die dynamische Rücksprung-Adresse (`backUrl`) an die `<NoteForm />`-Komponente.
