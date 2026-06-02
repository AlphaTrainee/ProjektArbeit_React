# Datei: `src/app/notizen/page.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei stellt die Hauptübersicht der Notizen-Anwendung bereit (Server Page). Sie verarbeitet optionale Suchparameter aus der URL (Query-Strings), führt die entsprechende serverseitige Datenbankabfrage aus und koordiniert das Zusammenspiel der Filter-, Such- und Listenkomponenten auf der Benutzeroberfläche.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Typdefinition: `PageProps`

Entspricht dem Standard-Typ für Seitenkomponenten in Next.js 15.

- **`searchParams`**: Ein `Promise`, das die URL-Query-Parameter (wie z. B. `?q=Suchbegriff`) asynchron bereitstellt.

### 2. Funktion: `NotizenPage` (Server Component)

- **Aufgabe**: Steuert den Datenfluss (Suchen und Laden) auf der zentralen Notizen-Übersichtsseite.
- **Ablauf**:
  1. Löst das `searchParams`-Promise mittels `await` auf und extrahiert den Suchbegriff `q` typsicher als String.
  2. **Dynamische SQL-Generierung**:
     - Wenn ein Suchbegriff vorhanden ist, wird eine gefilterte SQL-Abfrage (`SELECT * FROM notes WHERE title LIKE ? OR content LIKE ?`) ausgeführt, um Titel und Inhalt nach dem Begriff zu durchsuchen.
     - Wenn kein Suchbegriff übergeben wurde, lädt die Anwendung standardmäßig alle Notizen, absteigend sortiert nach ID (`ORDER BY id DESC`).
  3. Formatiert die Rohdaten der Datenbank-Zeilen (`result.rows`) in ein sauberes, typsicheres Array (`allNotes`).
  4. **Bedingte UI-Steuerung (If-Else / Ternärer Operator)**:
     - Befindet sich der Nutzer in einer aktiven Suche, wird ein "Suche aufheben"-Button (`<Link>`) angezeigt, der die URL zurücksetzt.
     - Gibt es keine aktive Suche, wird stattdessen die Eingabekomponente `<SearchInput />` am rechten Rand gerendert.
  5. Reicht die geladenen Notizen sowie den aktuellen Suchbegriff an die untergeordneten Komponenten (`<CategoryFilter />` und `<NotesList />`) zur weiteren Verarbeitung und Darstellung weiter.
