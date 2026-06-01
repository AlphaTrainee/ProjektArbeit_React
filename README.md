# ProjektArbeit React

#### [Anforderung: Projekt Beschreibung](project_beschreibung.md)

## Projekt inititalisieren und vorbereiten

> https://gemini.google.com/app/d97856317e42843b

```bash
npx create-next-app@latest notizbuch-app --typescript --eslint --tailwind --src-dir --app --no-turbopack --import-alias "@/*"
cd notizbuch-app
npm install @libsql/client zustand @tanstack/react-query
npm install mysql2
npm i zod
npm i react-hook-form @hookform/resolvers
```

```bash
# Hilfsprogramm für npm
npm install -D tsx

# Datenbank initialisieren :: Update
npm run db:new
npm run db:reset # die Tabelle wird gelöscht und neu erstellt
```

## Projekt Thema

<blockquote>
Der Plan: Wir bauen ein "Digitales Notizbuch" (Ideen-Sammler)

Kein Schnickschnack, keine Logins, keine komplexen Relationen. Nur eine Tabelle in der Datenbank: notes (id, title, content, category).

So haken wir die Punkte mit minimalem Code ab:

1. Die Datenbank (Punkt 3 & 4)

Wir nehmen eine lokale SQLite-Datei. Keine Cloud, kein Setup-Wahnsinn. Eine Tabelle, drei Spalten. 2. Die Hauptseite (Punkt 1 & 2 & 3)

    Server Component (RSC): Die Startseite lädt einfach stumpf alle Notizen direkt aus der SQLite-Datenbank und listet sie auf.

    Dynamische Route (/[id]): Wenn man auf eine Notiz klickt, landet man auf einer Detailseite, die genau diese eine Notiz per ID aus der Datenbank liest.

3. Formular & Server Actions (Punkt 4, 5, 6)

   Create/Update: Ein einfaches Formular, um eine Notiz anzulegen oder zu ändern.

   Das Formular schickt die Daten an eine Server Action (das erfüllt Punkt 4 und 5 auf einen Schlag, Route Handler ignorieren wir einfach – Begründung für die Präsentation: "Server Actions sparen API-Code").

   Für den State nutzen wir useActionState für die Fehlermeldung, falls der Titel leer ist.

4. Client Data Layer & TanStack Query (Punkt 8)

Hier tricksen wir. Wir bauen einfach ein kleines Suchfeld oder eine Kategorie-Filter-Leiste als Client Component. Wenn man da tippt, feuert TanStack Query einen Request ab.

    Deine Begründung für die Präsentation, warum kein useEffect: "TanStack Query bietet automatisches Caching und Out-of-the-box Ladezustände, wodurch wir fehleranfälligen Boilerplate-Code mit useEffect vermeiden."

5. State Management (Punkt 9)

Wir nehmen Zustand. Warum? Weil Zustand die mit Abstand einfachste Library ist. Man braucht genau 5 Zeilen Code, um einen Store zu erstellen, im Gegensatz zu dem Redux-Monster.

    Wir speichern dort einfach nur eine einzige Sache: Ob die Filter-Leiste offen oder geschlossen ist (isFilterOpen: boolean). Zack, Anforderung erfüllt.

    Deine Begründung: "Für ein globales UI-Flag war Context API zu aufwendig (Re-Renders) und Redux komplett überdimensioniert. Zustand ist schlank und performant."

6. Styling (Punkt 10)

Wir nutzen ein fertiges Tailwind CSS-Template oder klatschen einfach standardisierte CSS-Klassen drauf. Der Fokus liegt laut Aufgabe eh nicht auf CSS.

</blockquote>
