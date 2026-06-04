# ProjektArbeit React

## Schnellstart

```bash
# *.zip File entpacken

# in den Projekt Ordner wechseln
cd c:\...\ProjektOrdner

# in den App Ordner wechseln
cd notizbuch-app

# die notwendigen Pakete installieren
npm i

# die benötigte .env.local erzeugen (das mitgelieferte Beispiel nutzen)
copy .env.local.example .env.local

# per default wird sqlite genutzt um ein DB File zu erstellen
# Ansonsten die Einstellungen anpassen

# Datenbank erzeugen
npm run db:new

# ODER Datenbank zurücksetzen (alle Inhalte werden auf den Ursprungszustand gesetzt)
npm run db:reset

# das Projekt kann gestartet werden
npm run dev
```

#### [Anforderung: Projekt Beschreibung](project_beschreibung.md)

## Projekt inititalisieren und vorbereiten

```bash
npx create-next-app@latest notizbuch-app --typescript --eslint --tailwind --src-dir --app --no-turbopack --import-alias "@/*"
cd notizbuch-app
npm install @libsql/client zustand @tanstack/react-query
npm install mysql2
npm i zod
npm i react-hook-form @hookform/resolvers
```

### API Endpunkte erstellen und dokumentieren

```bash
npm install swagger-ui-react swagger-jsdoc
npm install --save-dev @types/swagger-ui-react @types/swagger-jsdoc
```

## Datenbank Handling

Um sich das Erstellen / Resetten der Datenbank zu vereinfachen, kann man folgende Einträge der
`package.json` hinzufügen

```bash
  "scripts": {
    ....
    "db:new": "node --env-file=.env.local --import tsx src/db/init.ts",
    "db:reset": "node --env-file=.env.local --import tsx src/db/init.ts --reset"
  }
```

Die Einstellungen werden aus `.env.local` geladen, dieses File muss vorhanden sein

### Notwendiges Paket installieren / Aufruf des Scripts

```bash
# Hilfsprogramm für npm
npm install -D tsx

# Datenbank initialisieren :: Update
npm run db:new
npm run db:reset # die Tabelle wird gelöscht und neu erstellt
```

```bash
# um npm run dev:clean zu nutzen
npm i rimraf
```

```bash
  "scripts": {
    ....
    "dev:clean": "rimraf .next && next dev",
  }
```

## Projekt Thema: Digitales Notizbuch

### Projektstruktur & Dokumentation

Hier findest du die Übersicht der Projektkomponenten. Klicke auf eine Datei, um direkt zur jeweiligen Dokumentationsseite zu gelangen:

- `notizbuch-app/`
  - `src/`
    - `actions/`
      - 📄 [`actions.ts`](./DOCS/src-actions-actions.ts.md) — _Server Actions für Notizen (z. B. Löschen)_
    - `app/`
      - `notizen/`
        - `[id]/`
          - `bearbeiten/`
            - 📄 [`page.tsx`](./DOCS/src-app-notizen-%5Bid%5D-bearbeiten-page.tsx.md) — _Dynamische Server Page zum Editieren von Einträgen_
        - `neu/`
          - 📄 [`page.tsx`](./DOCS/src-app-notizen-neu-page.tsx.md) — _Server Page für das Erstellen neuer Notizen_
        - 📄 [`page.tsx`](./DOCS/src-app-notizen-page.tsx.md) — _Hauptseite der Notizen mit Suche und Filterung_
    - `components/`
      - 📄 [`CategoryFilter.tsx`](./DOCS/src-components-CategoryFilter.tsx.md) — _Client-Komponente für die Kategorie-Auswahlbuttons_
      - 📄 [`HighlightedText.tsx`](./DOCS/src-components-HighlightedText.tsx.md) — _Text-Highlighter für die optische Suchtreffer-Markierung_
      - 📄 [`NoteCard.tsx`](./DOCS/src-components-NoteCard.tsx.md) — _Einzelne Notizkarte inklusive direktem Lösch-Formular_
      - 📄 [`NoteForm.tsx`](./DOCS/src-components-NoteForm.tsx.md) — _Zentrales Hybrid-Formular (Erstellen und Bearbeiten)_
      - 📄 [`NotesList.tsx`](./DOCS/src-components-NotesList.tsx.md) — _Verwaltet Filterung, Pagination (3er-Limit) und Listen-Rendering_
      - 📄 [`SearchInput.tsx`](./DOCS/src-components-SearchInput.tsx.md) — _Suchfeld-Eingabe mit moderner React 19 Form Action_
    - `data/`
      - 📄 [`insertNotes.ts`](./DOCS/src-data-insertNotes.ts.md) — _Server Action für Create/Update mit dynamischem Redirect_
      - 📄 [`schema.ts`](./DOCS/src-data-schema.ts.md) — _Zod-Validierungsschema für die Formulardaten_
    - `db/`
      - 📄 [`init.ts`](./DOCS/src-db-init.ts.md) — _Datenbank-Initialisierung und Seeding-Skript für Testdaten_
    - `lib/`
      - 📄 [`db.ts`](./DOCS/src-lib-db.ts.md) — _Database Abstraction Layer (Weiche für MySQL / LibSQL)_
    - `store/`
      - 📄 [`filterStore.ts`](./DOCS/src-store-filterStore.ts.md) — _Zustand-Store für die globale Kategorie-Filterung_
    - `types/`
      - 📄 [`note.ts`](./DOCS/src-types-note.ts.md) — _Zentrale TypeScript-Typen und abgeleitete Zod-Schemata_
    - `widgets/`
      - 📄 [`WeatherWidget.tsx`](./DOCS/src-widgets-WeatherWidget.tsx.md) — _Asynchrone Server Component für Hamburger Live-Wetterdaten_
