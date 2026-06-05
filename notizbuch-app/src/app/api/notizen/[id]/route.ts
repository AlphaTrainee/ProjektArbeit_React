import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { noteSchema } from "@/data/schema";
import { formatZodErrors } from "@/types/fieldTypes";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// ==========================================
// PUT: Notiz aktualisieren
// ==========================================
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsedResult = noteSchema.safeParse(body);

    if (!parsedResult.success) {
      return NextResponse.json(
        {
          result: false,
          error: "could not save",
          errors: formatZodErrors(parsedResult.error),
        },
        { status: 400 },
      );
    }

    const { title, content, category } = parsedResult.data;

    try {
      await db.execute({
        sql: "UPDATE notes SET title = ?, content = ?, category = ? WHERE id = ?",
        args: [title, content, category, id],
      });
    } catch (e) {
      return NextResponse.json(
        {
          result: false,
          error: `Probleme beim Aktualisieren: ${e instanceof Error ? e.message : "Unbekannter Datenbankfehler"}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      result: true,
      data: {
        id: id,
        title: title,
        content: content,
        category: category,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `${e instanceof Error ? e.message : "Ungültiges JSON-Format"}` },
      { status: 400 },
    );
  }
}

// ==========================================
// DELETE: Notiz löschen
// ==========================================
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    try {
      await db.execute({
        sql: "DELETE FROM notes WHERE id = ?",
        args: [id],
      });
    } catch (e) {
      return NextResponse.json(
        {
          result: false,
          error: `Probleme beim Löschen: ${e instanceof Error ? e.message : "Unbekannter Datenbankfehler"}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      result: true,
      id: id,
    });
  } catch (e) {
    return NextResponse.json(
      { error: `${e instanceof Error ? e.message : "Interner Serverfehler"}` },
      { status: 500 },
    );
  }
}
