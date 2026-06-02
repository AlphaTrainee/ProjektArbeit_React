# Datei: `src/widgets/WeatherWidget.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei stellt eine eigenständige **Server-Komponente (WeatherWidget)** bereit. Sie fungiert als Dashboard-Erweiterung, die asynchron Echtzeit-Wetterdaten für den Standort Hamburg von einer externen API (Open-Meteo) abruft. Die Komponente ist robust gegen Netzwerkausfälle abgesichert und rendert im Fehlerfall eine benutzerfreundliche Warnmeldung, ohne die gesamte Anwendung zum Absturz zu bringen.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Funktion: `WeatherWidget` (Server Component)

- **Aufgabe**: Holt Wetterdaten serverseitig und rendert ein Infobanner.
- **Ablauf**:
  1. **Asynchroner API-Aufruf**: Sendet mittels einer `fetch`-Anfrage eine HTTP-GET-Anforderung an die Open-Meteo REST-API mit den geografischen Koordinaten für Hamburg.
  2. **Cache-Steuerung**: Durch die Konfiguration `{ cache: "no-store" }` wird Next.js explizit angewiesen, die Antwort niemals dauerhaft zwischenzuspeichern. Bei jedem Laden oder Aktualisieren der Startseite wird die API frisch abgefragt, um aktuelle Live-Werte zu garantieren.
  3. **Fehlerabfangung (Try-Catch)**: Der gesamte Abruf- und Parsing-Prozess ist in einen `try...catch`-Block gehüllt. Sollte die externe API offline sein, ein ungültiges Format liefern oder der Server keine Internetverbindung haben, wird der Zustand über das Flag `hasError = true` registriert.
  4. **Strikte Trennung von Logik und UI**: Das eigentliche Rendering erfolgt vollständig außerhalb des Fehlerblocks, aufgeteilt in zwei logische Pfade:
     - **Bedingtes Rendering (Fall 1 - Fehler)**: Ist `hasError` wahr, wird ein rotes, barrierefreies Warnfeld ausgegeben.
     - **Standard-Rendering (Fall 2 - Erfolg)**: War der Datentransfer erfolgreich, wird ein visuell ansprechendes, blaues Info-Widget ausgegeben, das die aktuelle Temperatur formatiert anzeigt (z. B. **180°C** oder im unwahrscheinlichen Fall fehlender Datenpunkte als `-- °C`).
