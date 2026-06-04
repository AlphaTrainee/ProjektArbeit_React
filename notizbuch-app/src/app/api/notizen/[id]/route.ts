import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();

  // Wichtig: Explizites Mapping der Daten, um den Turbopack-Fehler zu umgehen
  return new NextResponse(
    JSON.stringify({
      message: `Eintrag ${String(id)} bearbeitet`,
      data: body,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  return new NextResponse(
    JSON.stringify({
      message: `Eintrag ${String(id)} gelöscht`,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
