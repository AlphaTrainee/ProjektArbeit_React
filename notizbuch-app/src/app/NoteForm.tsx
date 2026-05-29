"use client"; // Kennzeichnet dies als Client-Komponente für Interaktionen

import { useActionState } from "react";
import { createNoteAction } from "./actions";

export function NoteForm() {
  // Anforderung 6: useActionState für Server-Rückgaben (Fehler / Status)
  // Erster Parameter ist die Action, der zweite der Start-Zustand
  const [state, formAction, isPending] = useActionState(createNoteAction, {
    error: null,
    success: false,
  });

  return (
    <form
      action={formAction}
      className="mb-8 p-4 border rounded-lg bg-gray-50 space-y-3"
    >
      <h3 className="text-lg font-semibold">Neue Notiz anlegen</h3>

      {/* Fehlermeldung anzeigen, falls vorhanden */}
      {state?.error && (
        <p className="text-red-600 text-sm font-medium">{state.error}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Titel</label>
        <input
          type="text"
          name="title"
          className="mt-1 block w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Inhalt
        </label>
        <textarea
          name="content"
          rows={3}
          className="mt-1 block w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Kategorie
        </label>
        <select
          name="category"
          className="mt-1 block w-full rounded border p-2"
        >
          <option value="Arbeit">Arbeit</option>
          <option value="Privat">Privat</option>
          <option value="Idee">Idee</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isPending ? "Wird gespeichert..." : "Notiz speichern"}
      </button>
    </form>
  );
}
