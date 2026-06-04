import MySwaggerUI from "@/components/SwaggerUI";

export const dynamic = "force-dynamic";

const spec = {
  openapi: "3.0.0",
  info: {
    title: "Notizbuch API Dokumentation",
    version: "1.0.0",
  },
  paths: {
    "/api/notizen": {
      get: {
        description: "Gibt die Liste aller vorhandenen Notizen zurück",
        responses: {
          "200": { description: "Erfolg" },
        },
      },
      post: {
        description: "Erstellt eine neue Notiz",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Notiz erfolgreich erstellt" },
        },
      },
    },
    "/api/notizen/{id}": {
      put: {
        description: "Bearbeitet eine vorhandene Notiz",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Notiz aktualisiert" },
        },
      },
      delete: {
        description: "Löscht eine Notiz anhand ihrer ID",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Notiz gelöscht" },
        },
      },
    },
  },
};

export default async function ApiDocPage() {
  return (
    <>
      <MySwaggerUI spec={spec} />
    </>
  );
}
