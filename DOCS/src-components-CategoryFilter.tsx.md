# Datei: `src/components/CategoryFilter.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Client-Komponente stellt die **Filterleiste für die Notiz-Kategorien** auf der Benutzeroberfläche bereit. Sie liest die aktuell gewählte Kategorie aus dem globalen Zustand (Zustand-Store) aus, rendert die entsprechenden Filter-Buttons und aktualisiert den Zustand global, sobald der Benutzer eine andere Kategorie auswählt.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Interaktion mit dem Zustand: `useFilterStore`

Die Komponente nutzt die `"use client"`-Direktive, da sie auf Benutzerinteraktionen reagiert und einen Client-Zustand verwendet.

- **`currentCategory`**: Holt den aktuell aktiven Filter (z. B. "Alle" oder "Arbeit"), um den aktiven Button optisch hervorzuheben.
- **`setCategory`**: Holt die Funktion, mit der die global aktive Kategorie beim Klicken auf einen Button neu gesetzt wird.

### 2. Funktion: `CategoryFilter` (Client Component)

- **Aufgabe**: Rendert eine Reihe von Buttons basierend auf einer vordefinierten Liste von Kategorien.
- **Ablauf**:
  1. Definiert die verfügbaren Kategorien in einem lokalen Array (`["Alle", "Arbeit", "Privat", "Idee"]`).
  2. Iteriert mittels `.map()` über dieses Array, um für jede Kategorie einen `<button>` zu erzeugen.
  3. **Dynamische CSS-Klassen (Styling)**:
     - Entspricht die Kategorie dem Wert aus `currentCategory`, wird der Button im aktiven Zustand (blau ausgefüllt) dargestellt.
     - Andernfalls wird er im inaktiven Zustand (weiß mit grauem Rahmen und Hover-Effekt) dargestellt.
  4. Über das `onClick`-Event wird bei einem Klick die Funktion `setCategory(cat)` ausgeführt, was eine sofortige Filterung der Notizliste in anderen Komponenten anstößt.
