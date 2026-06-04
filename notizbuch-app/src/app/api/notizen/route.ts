import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { noteSchema, Note } from "@/data/schema";
import { z } from "zod";

type Err = { message: string };

type FieldErrors = {
  title: Err | null;
  content: Err | null;
  category: Err | null;
};

export async function GET() {
  try {
    const result = await db.execute("SELECT * FROM notes ORDER BY id");

    const latestNotes: Note[] = (result.rows as Record<string, unknown>[]).map(
      (row) =>
        noteSchema.parse({
          id: row.id?.toString(),
          title: row.title,
          content: row.content,
          category: row.category,
        }),
    );

    // Wandelt das Array in ein JSON-kompatibles Objekt-Format um
    return NextResponse.json({
      data: JSON.parse(JSON.stringify(latestNotes)) as Note[],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Laden der Notizen" },
      { status: 500 },
    );
  }
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedResult = noteSchema.safeParse(body);

    if (!parsedResult.success) {
      console.log("falsches datenformat");
      return NextResponse.json(
        {
          result: false,
          error: "could not save",
          errors: formatZodErrors(parsedResult.error),
        },
        { status: 400 },
      );
    }

    // Nur die Daten extrahieren, die für das Einfügen gebraucht werden
    const { title, content, category } = parsedResult.data;
    let insertedId: string | undefined;

    try {
      // Reiner Neu-Modus: Es wird ausnahmslos eingefügt
      const result = await db.execute({
        sql: "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)",
        args: [title, content, category],
      });
      insertedId = result.insertId?.toString();
    } catch (e) {
      console.error("Datenbankfehler beim Speichern:", e);
      return NextResponse.json(
        {
          result: false,
          error: `Probleme beim Speichern: ${e instanceof Error ? e.message : "Unbekannter Datenbankfehler"}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        result: true,
        data: {
          id: insertedId,
          title: title,
          content: content,
          category: category,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Ungültiges JSON-Format" },
      { status: 400 },
    );
  }
}
