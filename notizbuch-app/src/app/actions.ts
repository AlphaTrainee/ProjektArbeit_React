"use server";

import { db } from "@/db/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; // <-- NEU: Für die Weiterleitung

export async function createNoteAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;

  // Validierung
  if (!title || !content || !category) {
    return { error: "Bitte alle Felder ausfüllen!" };
  }

  try {
    // In SQLite einfügen
    await db.execute({
      sql: "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)",
      args: [title, content, category],
    });
  } catch (e) {
    return { error: "Datenbankfehler beim Speichern." };
  }

  // Daten-Cache für die Startseite und die Notizseite löschen
  revalidatePath("/");
  revalidatePath("/notizen");

  // <-- NEU: Den Nutzer automatisch zurück zum Dashboard schicken
  redirect("/");
}
