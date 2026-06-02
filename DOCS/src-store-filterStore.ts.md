# Datei: `src/store/filterStore.ts`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei definiert den **globalen Client-Zustand für die Kategorien-Filterung** mithilfe der leichtgewichtigen Zustandsverwaltungs-Bibliothek _Zustand_. Sie stellt der gesamten Anwendung (insbesondere der Filterleiste und der Notizliste) den aktuell ausgewählten Filterwert sowie eine Funktion zu dessen Änderung global zur Verfügung, ohne dass Daten mühsam über mehrere Komponenten-Ebenen hinweg (Prop-Drilling) weitergereicht werden müssen.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Schnittstelle: `FilterState`

Definiert die Typsicherheit für den Zustandsspeicher.

- **`currentCategory`**: Eine Zeichenkette (`string`), die den Namen der aktuell selektierten Kategorie speichert (z. B. `"Alle"`, `"Arbeit"`, `"Privat"`, `"Idee"`).
- **`setCategory`**: Die Signatur einer Funktion, die eine neue Kategorie als String entgegennimmt und keinen Rückgabewert liefert (`void`).

### 2. Globaler Store: `useFilterStore`

Erstellt den eigentlichen React-Hook mittels der `create`-Methode von Zustand.

- **`currentCategory` (Initialwert)**: Ist standardmäßig auf `"Alle"` gesetzt, sodass beim ersten Laden der Anwendung alle Notizen ungefiltert sichtbar sind.
- **`setCategory` (Action)**: Nutzt die interne `set`-Methode von Zustand, um den Wert von `currentCategory` atomar im Speicher zu überschreiben. Sobald diese Funktion von einer Komponente (wie dem `<CategoryFilter />`) aufgerufen wird, triggert Zustand automatisch ein hocheffizientes Re-Rendering aller Komponenten, die diesen Wert aktiv abhören (wie die `<NotesList />`).
