# Datei: `src/components/HighlightedText.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese wiederverwendbare Hilfskomponente dient dem **Hervorheben von Textpassagen** (Highlighter). Sie durchsucht einen übergebenen Text nach einem bestimmten Suchbegriff und hebt alle Treffer dynamisch, ohne Berücksichtigung von Groß- und Kleinschreibung (case-insensitive), mit einem gelb hinterlegten HTML-`<mark>`-Tag optisch hervor.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Typdefinition: `HighlightedTextProps`

Definiert die Schnittstelle für die Eingabedaten der Komponente.

- **`text`**: Der vollständige Originaltext (z. B. der Titel oder Inhalt einer Notiz), der durchsucht werden soll.
- **`highlight`**: Der Suchbegriff, der im Text farblich markiert werden soll.

### 2. Funktion: `HighlightedText` (Helper Component)

- **Aufgabe**: Zerlegt den Text und rendert die Suchtreffer formatiert als JSX-Elemente.
- **Ablauf**:
  1. **Sicherheitsprüfung**: Wenn der Suchbegriff leer ist oder nur aus Leerzeichen besteht (`!highlight.trim()`), wird der Text sofort unverändert als Fragment (`<>{text}</>`) zurückgegeben.
  2. **Regex-Escaping**: Sonderzeichen im Suchbegriff (wie `?`, `*`, `+` etc.) werden über eine Regular Expression (`.replace`) mit einem Backslash versehen (`safeHighlight`). Dies verhindert Abstürze des Programms, falls der Nutzer nach mathematischen oder systemischen Zeichen sucht.
  3. **Textaufteilung**: Der Text wird mithilfe einer dynamischen Regex (`new RegExp`) und den Flags `g` (global) und `i` (case-insensitive) in ein Array aus Textsplittern (`parts`) zerlegt. Durch die runden Klammern in der Regex bleiben die Suchtreffer selbst als eigene Elemente im Array erhalten.
  4. **Rendering über Mapping**: Iteriert mit `.map()` über alle Textteile:
     - Entspricht ein Textteil dem Suchbegriff (unabhängig von Groß-/Kleinschreibung), wird er in ein `<mark>`-Tag mit einer gelben Hintergrundklasse (`bg-yellow-200`) gehüllt.
     - Alle anderen Textteile werden als normaler Text ausgegeben.
