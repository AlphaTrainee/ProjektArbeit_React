# Datei: `src/components/SearchInput.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Client-Komponente stellt das **Such-Eingabefeld** der Anwendung bereit. Sie fängt die Benutzereingabe ab und leitet den Anwender an eine konfigurierbare Zielroute (Standard: `/notizen`) weiter, wobei der eingegebene Suchbegriff als URL-Query-Parameter (`?q=Suchbegriff`) angehängt wird. Dadurch wird eine rein URL-basierte Suche ermöglicht, die auch beim Neuladen der Seite erhalten bleibt.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Typdefinition: `SearchInputProps`

- **`targetRoute`**: Bestimmt optional die Zielseite, auf der gesucht werden soll. Standardmäßig ist dieser Parameter auf `"/notizen"` gesetzt.

### 2. Funktion: `SearchInput` (Client Component)

- **Aufgabe**: Verwaltet das Suchformular unter Verwendung moderner React 19 / Next.js Mechanismen.
- **Ablauf**:
  1. Initialisiert den Next.js-Router über den Hook `useRouter()`, um clientseitige Seitennavigationen ausführen zu können.
  2. **Moderne Formularverarbeitung (`handleSearchAction`)**:
     - Anstatt des klassischen `onSubmit`-Event-Handlers nutzt diese Komponente das in React 19 eingeführte `action`-Attribut direkt auf dem `<form>`-Element.
     - Die Funktion erhält beim Absenden automatisch ein natives `FormData`-Objekt, aus dem der Wert des Eingabefeldes über dessen `name`-Attribut (`"searchQuery"`) ausgelesen wird.
     - Der extrahierte Text wird von führenden und nachfolgenden Leerzeichen bereinigt (`.trim()`).
  3. **Navigation**:
     - Wenn ein gültiger Suchbegriff eingegeben wurde, codiert die Funktion den String mittels `encodeURIComponent(query)` (um Sonder- und Leerzeichen URL-konform zu maskieren).
     - Der Router führt anschließend einen Push-Befehl aus (z. B. nach `/notizen?q=MeinSuchbegriff`), was auf der Zielseite die serverseitige Datenbankfilterung triggert.
