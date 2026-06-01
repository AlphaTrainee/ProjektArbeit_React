"use server";

import { db as client } from "../lib/db";
import { noteSchema } from "./schema";
import { redirect } from "next/navigation";
import { z } from "zod";

type Err = { message: string };

type FieldErrors = {
  title: Err | null;
  content: Err | null;
  category: Err | null;
};

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
    error = "Probleme beim Speichern ";
  }

  if (client) {
    client.close();
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

function formatZodErrors(error: z.ZodError): FieldErrors {
  const formattedErrors: FieldErrors = {
    title: null,
    content: null,
    category: null,
  };

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === "title" && !formattedErrors.title)
      formattedErrors.title = { message: issue.message };
    if (field === "content" && !formattedErrors.content)
      formattedErrors.content = { message: issue.message };
    if (field === "category" && !formattedErrors.category)
      formattedErrors.category = { message: issue.message };
  }

  return formattedErrors;
}
