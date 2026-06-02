# Datei: `src/components/NotesList.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Client-Komponente ist für das **Filtern, die Seitennavigation (Pagination) und das Rendern der Notizliste** zuständig. Sie nimmt die vom Server geladenen Notizen entgegen, wendet den aktuell im Zustand aktiven Kategorie-Filter an, berechnet die Seitenaufteilung (maximal 3 Einträge pro Seite) und bereitet die Texte mit Suchmarkierungen vor, bevor sie an die einzelnen Karten übergeben werden.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Schnittstellen & Typdefinitionen

- **`Note`**: Definiert die Struktur eines einzelnen Notiz-Objekts innerhalb der Liste.
- **`NotesListProps`**: Bestimmt die erwarteten Eingangsparameter:
  - `initialNotes`: Das Array mit allen geladenen Notizen vom Server.
  - `searchQuery`: Der aktuelle Suchbegriff für die Textmarkierung.

### 2. Kernlogik & Berechnungen

- **Kategorie-Filterung**:
  Nutzt die globale Zustandskomponente `useFilterStore`, um das Array zu filtern. Steht der Filter auf `"Alle"`, werden alle Notizen durchgelassen. Andernfalls verbleiben nur Notizen, deren Kategorie exakt dem aktiven Filter entspricht.

- **Automatischer Seiten-Reset**:
  Ein lokaler State-Vergleich (`lastCategory`) überwacht den Filter. Wechselt der Benutzer die Kategorie, springt die Seitennavigation über `setCurrentPage(1)` sofort zurück auf Seite 1, um leere Ansichten zu verhindern.

- **Pagination-Mathematik**:
  - `totalPages`: Berechnet die Gesamtseitenanzahl basierend auf dem Limit von 3 Einträgen (`Math.ceil(totalItems / 3)`).
  - `indexOfFirstItem` / `indexOfLastItem`: Ermittelt die exakten Indexgrenzen für das aktuelle Array-Segment.
  - `currentNotes`: Schneidet mittels `.slice()` genau die 3 Notizen heraus, die auf der aktuellen Seite angezeigt werden müssen.

### 3. Transformation & Rendering

- **Dynamische Text-Hervorhebung**:
  Beim Durchlaufen der aktuellen Notizen (`.map()`) wird jedes Objekt in ein modifiziertes `highlightedNote`-Objekt transformiert. Dabei werden die reinen Strings von `title` und `content` durch die JSX-Komponente `<HighlightedText />` ersetzt. Da die nachgelagerte `NoteCard` Typ-strikte Strings erwartet, wird hier ein TypeScript-Typecast (`as unknown as string`) eingesetzt.
- **Seitennavigation (UI)**:
  Befinden sich mehr als 3 Notizen in der Auswahl (`totalPages > 1`), blendet die Komponente im unteren Bereich Steuerungselemente ein. Die "Zurück"- und "Weiter"-Buttons sind über mathematische Limits (`Math.max` bzw. `Math.min`) abgesichert und sperren sich selbsttätig (`disabled`),
