"use server";

// import { db } from "@/db/database";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { noteSchema, noteFormSchema } from "@/data/schema";

export type ActionState = {
  success: boolean;
  error: string | null;
  fieldErrors?: {
    title?: string[];
    content?: string[];
    category?: string[];
  } | null;
};

// === CREATE ACTION ===
export async function createNoteAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const returnUrl = (rawData.returnUrl as string) || "/notizen";
  const validation = noteFormSchema.safeParse(rawData);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    validation.error.issues.forEach((issue) => {
      const path = issue.path[0] as string;
      if (path) {
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
    });
    return { success: false, error: "Validierung fehlgeschlagen", fieldErrors };
  }

  try {
    await db.execute({
      sql: "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)",
      args: [
        validation.data.title,
        validation.data.content,
        validation.data.category,
      ],
    });
  } catch (err) {
    return {
      success: false,
      error: "Datenbankfehler beim Erstellen",
      fieldErrors: null,
    };
  }

  revalidatePath("/");
  revalidatePath("/notizen");
  redirect(returnUrl);
}

// === UPDATE ACTION ===
export async function updateNoteAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const returnUrl = (rawData.returnUrl as string) || "/notizen";

  // Explizite Konvertierung der ID für die Zod-Validierung
  const payload = {
    id: Number(rawData.id),
    title: rawData.title,
    content: rawData.content,
    category: rawData.category,
  };

  const validation = noteSchema.safeParse(payload);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    validation.error.issues.forEach((issue) => {
      const path = issue.path[0] as string;
      if (path) {
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
    });
    return { success: false, error: "Validierung fehlgeschlagen", fieldErrors };
  }

  try {
    await db.execute({
      sql: "UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ?",
      args: [
        validation.data.title,
        validation.data.content,
        validation.data.category,
        validation.data.id,
      ],
    });
  } catch (err) {
    return {
      success: false,
      error: "Datenbankfehler beim Aktualisieren",
      fieldErrors: null,
    };
  }

  revalidatePath("/");
  revalidatePath("/notizen");
  redirect(returnUrl);
}

// === DELETE ACTION ===
export async function deleteNoteAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const id = Number(rawData.id);
  const returnUrl = (rawData.returnUrl as string) || "/notizen";

  if (isNaN(id)) {
    return { success: false, error: "Ungültige ID", fieldErrors: null };
  }

  try {
    await db.execute({
      sql: "DELETE FROM notes WHERE id = ?",
      args: [id],
    });
  } catch (err) {
    return {
      success: false,
      error: "Datenbankfehler beim Löschen",
      fieldErrors: null,
    };
  }

  revalidatePath("/");
  revalidatePath("/notizen");
  redirect(returnUrl);
}
