## Wochen-Projekt: React mit TypeScript in Next.js

**Präsentation:** Freitag, **05.06., 15:30**

Ziel ist **kein Feature-Abarbeiten**, sondern der Bau eines **kleinen, realistischen Produkts**, das moderne Next.js-Konzepte sauber nutzt.
Das **Thema ist frei wählbar**, solange die untenstehenden Kernanforderungen erfüllt sind.

---

## Kernanforderungen

### 1) Architektur: RSC & Client Components

- Mindestens **eine Page als React Server Component (RSC)** mit initialem Data Fetching.
- Mindestens **eine Client Component** für Interaktion (Buttons, Filter, Form-UI).
- Klare Trennung:
  **Lesen = Server**, **Interaktion = Client**.

---

### 2) Routing (params & searchParams)

- Mindestens **eine dynamische Route** (`/[id]`, `/[slug]`, etc.).
- Nutzung von **`searchParams`** ist optional.

---

### 3) Data Fetching im RSC

- Serverseitiges Laden der Daten. (Daten sollen von Datenbank kommen; z.b. Sqlite mit libsql)
- Einsatz von **Suspense** für Ladezustände. (optional)


---

### 4) Mutations mit Server Functions (Server Actions)

- Mindestens:
  - **Create** 
  - **Update**
    - (Daten sollen in Datenbank verändert werden; z.b. Sqlite mit libsql)

- Serverseitige Validierung.
- Fehlerzustände werden im UI angezeigt.

---

### 5) Forms in Next.js

- entweder

* **Eine Form mit Server Action**

- oder

* **Eine Form mit Route Handler (API Route)**
  → bewusster Vergleich der Ansätze.

---

### 6) Form-State-Handling

- Einsatz von **mindestens einem** Hook für Form State Handling:

- `useFormStatus` für Pending-UI.
- `useActionState` für Rückgaben vom Server (Errors / State).
- `useForm` (react-hook-form)

---

### 7) Error Handling (Optional)

- Eigene **Error Boundary** ist optional

---

### 8) Client Data Layer

- Mindestens **eine Client-Komponente mit TanStack Query**.
- Kurze Begründung, warum hier **nicht `useEffect`** verwendet wurde.

---

### 9) State Management

- Einsatz von **mindestens einer** State-Strategien:
  - Prop Drilling / Composition (wenn Prop Drilling, dann Begründung)
  - Context API
  - **Zustand**

- Klare Begründung der Entscheidung.

---

### 10) Styling

- Nutzung von einem:
  - CSS Modules
  - Tailwind CSS
  - Plain CSS (sparsam & begründet)
  - Hinweise:
    - der Fokus dieses Projektes soll nicht auf CSS liegen.
    - Es dürfen für CSS Templates verwendet werden

---

## Projekt-Checkliste

- [ ] RSC-Page mit Data Fetching
- [ ] Dynamische Route + Optional: `searchParams` 
- [ ] Suspense & Error Boundary (Optional)
- [ ] Datenbank einrichten z.b. Sqlite mit libSql
- [ ] Create & Update via Server Actions
- [ ] Formular (API oder Server Action)
- [ ] Sichtbarer Einsatz von Hooks für `Form-State Handling`
- [ ] TanStack Query in Client Component (oder UseEffect; TanStack empfohlen)
- [ ] Mindestens 1 State-Patterns (Komposition, Conetxt Api)
- [ ] Redux oder Zustand (Optional)
- [ ] 1 flexible Komponente (Optional)
- [ ] 1 Custom Hook (Optional)
- [ ] Saubere Typisierung (kein `any`)
- [ ] Saubere Projektstruktur

### (Bonus)

- [ ] Pagination / Infinite Scroll
- [ ] Mock-Auth / Session-Context
- [ ] Kleine Tests

---

## Themenfreiheit – Inspirationsbeispiele

Die folgenden Beispiele dienen nur zur Inspiration, und sind keine Vorgaben:

### Organisation & Produktivität

- Aufgaben- oder Lernplaner
- Kanban-Board / Issue-Tracker
- Meeting-Notizen oder Ideen-Sammler

### Content & Wissen

- Mini-Blog / Artikel-Plattform
- Rezept-Sammlung
- Buch- oder Film-Tracker
- Lernkarten-App

### Freizeit & Alltag

- Reise-Planer
- Sport- oder Trainings-Log
- Event-Übersicht
- Restaurant- oder Café-Finder

### Technik-nah

- API-Explorer
- Config-Manager
- Feature-Toggle-Dashboard
- Simple Admin-UI

### Kreativ / Sonstiges

- Umfrage-Tool
- Wishlist / Sammlung
- Community-Ideenboard

**Wichtig:**
- Das Thema ist egal – **die Architektur und Entscheidungen zählen**.
- Die genannten Kernanforderungen definieren den inhaltlichen Rahmen des Wochenprojekts.
- Es wird nicht erwartet, dass alle Punkte vollständig oder in maximaler Ausprägung umgesetzt werden.

In der Präsentation soll klar werden:
  - was ihr umgesetzt habt
  - warum ihr diese Entscheidungen getroffen habt
  - und welche Aspekte ihr bei mehr Zeit weiter ausbauen würdet.


---

## Präsentation (05.06., Freitag, 15:30)**

### Empfohlene Zeit

- **7-10 Minuten Präsentation**

### Vorgegebene Struktur

1. **Idee & Ziel der App** 
2. **Architektur-Überblick** (RSC vs Client, Routing) 
3. **Ein Kernfeature live zeigen** 
4. **Eine bewusste Entscheidung erklären**
   (z.B. Server Action vs Route Handler, Zustand vs Context)
5. **Was gelernt / was war schwierig?** 


### Hinweis

- Präsentation vorher üben
- Folien können helfen, sind aber optional 
