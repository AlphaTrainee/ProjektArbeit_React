import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { noteSchema, Note } from "@/data/schema";
import { z } from "zod";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

type Err = { message: string };

type FieldErrors = {
  title: Err | null;
  content: Err | null;
  category: Err | null;
};

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
  } catch (error) {
    return NextResponse.json(
      { error: "Ungültiges JSON-Format" },
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
  } catch (error) {
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 },
    );
  }
}
