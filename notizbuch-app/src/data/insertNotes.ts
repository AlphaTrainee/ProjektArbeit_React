"use server";

import { db as client } from "@/lib/db";
import { noteSchema } from "@/schema/schema";
import { redirect } from "next/navigation";
import { formatZodErrors, FieldErrors } from "@/schema/fieldTypes";

type ActionState = {
  result: boolean;
  error: string;
  formData: FormData;
  errors: FieldErrors;
};

export async function insertNote(
  previousState: ActionState,
  formData: FormData,
) {
  // 1. Alle Einträge aus dem Formular holen (inklusive unseres versteckten 'redirectTo')
  const note_obj = Object.fromEntries(formData);
  const parsedResult = noteSchema.safeParse(note_obj);

  let result = true;
  let error = "";

  if (!parsedResult.success) {
    console.log("falsches datenformat");
    return {
      result: false,
      error: "could not save",
      formData,
      errors: formatZodErrors(parsedResult.error),
    };
  }

  const { id, title, content, category } = parsedResult.data;

  // 2. Die dynamische URL direkt aus dem Formular-Objekt auslesen
  // Falls kein redirectTo übergeben wurde, nutzen wir "/" als sicheren Fallback.
  const targetUrl = (note_obj.redirectTo as string) || "/";

  try {
    if (id) {
      // Bearbeiten-Modus: Bestehende Notiz aktualisieren
      await client.execute({
        sql: "UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ?",
        args: [title, content, category, id],
      });
    } else {
      // Neu-Modus: Neue Notiz anlegen
      await client.execute({
        sql: "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)",
        args: [title, content, category],
      });
    }
  } catch (e) {
    result = false;
    // 1. Für dich im Server-Terminal loggen
    console.error("Datenbankfehler beim Speichern:", e);

    // 2. Dem Benutzer die genaue Meldung oder einen klaren Hinweis mitgeben
    error = `Probleme beim Speichern: ${e instanceof Error ? e.message : "Unbekannter Datenbankfehler"}`;
  }

  if (client) {
    // das gibt immerzu Fehler
    // Dies erledigt die db.ts automatisch
    // client.close();
  }

  // 3. HIER ERFOLGT DER DYNAMISCHE REDIRECT
  // Statt stur auf die Dankesseite zu leiten, springen wir zu der übergebenen 'targetUrl'
  if (result) {
    redirect(targetUrl);
  }

  return {
    result,
    error,
    formData,
    errors: { title: null, content: null, category: null },
  };
}
