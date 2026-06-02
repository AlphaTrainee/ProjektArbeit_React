# Datei: `src/components/NoteForm.tsx`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Client-Komponente ist das **zentrale Formular zum Erstellen und Bearbeiten von Notizen**. Sie vereint die clientseitige Formularverwaltung und Echtzeit-Validierung von _React Hook Form_ mit der asynchronen, serverseitigen Verarbeitung von _Next.js Server Actions_. Das Formular ist hybrid aufgebaut: Es reagiert flexibel darauf, ob ein leeres Dokument angelegt oder ein bestehender Datensatz modifiziert wird.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Typdefinition: `NoteFormProps`

Bestimmt die optionalen Übergabeparameter für den flexiblen Dual-Modus.

- **`note`**: Wenn vorhanden, befindet sich das Formular im _Bearbeitungs-Modus_ und befüllt die Felder vor. Wenn `undefined`, läuft es im _Erstellungs-Modus_.
- **`redirectTo`**: Die Zieladresse, zu welcher der Nutzer nach erfolgreicher Übermittlung umgeleitet wird.

### 2. Kombinierte Formularsteuerung (Hooks)

Die Komponente nutzt zwei mächtige Ansätze parallel, um maximale Stabilität zu garantieren:

- **`useActionState`**: Verarbeitet die Server Action `insertNote`. Sie fängt serverseitige Datenbankfehler ab und hält im Fehlerfall die zuvor eingegebenen Rohdaten (`formData`) im Speicher, damit Eingaben bei einem Fehlschlag nicht verloren gehen.
- **`useForm` (React Hook Form)**: Übernimmt die clientseitige Interaktion und steuert die Standardwerte (`defaultValues`). Über den `zodResolver(noteSchema)` blockiert sie unvollständige Formulareingaben sofort im Browser, bevor der Server überhaupt angefragt wird.

### 3. Funktion: `onSubmit`

- **Aufgabe**: Verbindet die Client-Validierung mit der Server Action.
- **Ablauf**:
  1. Nach erfolgreicher Prüfung durch React Hook Form wird `onSubmit` ausgeführt.
  2. Über `startTransition` wird die darauffolgende Zustandsänderung als nicht-blockierend markiert.
  3. Die Funktion sammelt die aktuellen Feldaten direkt über eine DOM-Referenz (`formRef`) als natives `FormData`-Objekt und übergibt sie an die Server-Schnittstelle (`formAction`).

### 4. Hilfskomponente: `FieldError`

- **Aufgabe**: Eine wiederverwendbare, barrierefreie UI-Weiche für die Fehlermeldungen einzelner Felder.
- **Ablauf**: Sie prüft über den Nullish Coalescing Operator (`??`), ob ein lokaler Client-Fehler (`clientError`) vorliegt. Ist dies nicht der Fall, greift sie auf eventuelle Rückmeldungen vom Server (`serverError`) zurück und rendert den Fehler mit dem Attribut `role="alert"`.
