import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { noteSchema, Note } from "@/schema/schema";
import { formatZodErrors } from "@/schema/fieldTypes";

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
  } catch (e) {
    return NextResponse.json(
      {
        error: `${e instanceof Error ? e.message : "Fehler beim Laden der Notizen"}`,
      },
      { status: 500 },
    );
  }
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
      console.error(
        `Probleme beim Speichern: ${e instanceof Error ? e.message : "Unbekannter Datenbankfehler"}`,
      );
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
  } catch (e) {
    return NextResponse.json(
      { error: `${e instanceof Error ? e.message : "Ungültiges JSON-Format"}` },
      { status: 400 },
    );
  }
}
