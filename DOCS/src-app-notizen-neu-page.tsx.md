# Datei: `src/app/notizen/neu/page.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei stellt die statische Server-Page zum **Erstellen einer neuen Notiz** bereit. Sie dient als struktureller Rahmen (Layout-Container), bindet das zentrale Formular ein und stellt einen funktionalen Abbrechen-Button zur Verfügung, der den Benutzer zurück zum Dashboard führt.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Funktion: `NeueNotizPage` (Server Component)

- **Aufgabe**: Rendert die Benutzeroberfläche für das Erstellungsfenster.
- **Ablauf**:
  1. Stellt eine Navigationsleiste mit einem `<Link>` bereit, der als "Abbrechen & Zurück"-Button fungiert und den Benutzer standardmäßig auf die Startseite (`/`) leitet.
  2. Bindet die wiederverwendbare Formular-Komponente `<NoteForm />` ein.
  3. Da an die Komponente keine bestehende Notiz übergeben wird (keine `note`-Prop), initialisiert sich das Formular automatisch im leeren "Erstellungs-Modus".
