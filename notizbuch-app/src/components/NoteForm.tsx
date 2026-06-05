"use client";

import { insertNote } from "@/data/insertNotes";
import { useActionState, useRef, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema } from "@/schema/schema";
import { NOTE_CATEGORIES } from "@/constants/types";

interface NoteFormProps {
  note?: {
    id: number;
    title: string;
    content: string;
    category: string;
  };
  redirectTo?: string;
}

export function NoteForm({ note, redirectTo }: NoteFormProps) {
  const [{ result, error, formData, errors }, formAction, isPending] =
    useActionState(insertNote, {
      result: false,
      error: "",
      formData: new FormData(),
      errors: {
        title: null,
        content: null,
        category: null,
      },
    });

  const {
    handleSubmit,
    register,
    formState: { errors: clientErrors },
  } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      id: note?.id?.toString() ?? "",
      title: note?.title ?? "",
      content: note?.content ?? "",
      category: note?.category ?? "",
      // Hier korrigiert: Wenn formData kein redirectTo enthält, nimm das Prop, ansonsten Fallback auf "/"
      redirectTo: (formData.get("redirectTo") as string) || redirectTo || "/",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit() {
    startTransition(() => {
      if (!formRef.current) return;

      console.log(formRef.current);

      formAction(new FormData(formRef.current));
    });
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => handleSubmit(onSubmit)(e)}
      className="mb-8 p-4 border rounded-lg bg-gray-50 space-y-3"
      noValidate
    >
      <h3 className="text-lg font-semibold">
        {note ? "Notiz bearbeiten" : "Neue Notiz anlegen"}
      </h3>

      {note && <input type="hidden" {...register("id")} value={note.id} />}

      {/* Das versteckte Eingabefeld liest den Wert jetzt direkt aus der korrigierten React-Hook-Form-Zustandssteuerung */}
      <input
        type="hidden"
        name="redirectTo"
        value={(formData.get("redirectTo") as string) || redirectTo || "/"}
      />

      {!result && error && (
        <p role="alert" className="text-red-600 text-sm font-medium">
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Titel
        </label>
        <input
          type="text"
          {...register("title")}
          id="title"
          className="mt-1 block w-full rounded border p-2"
          defaultValue={(formData.get("title") as string) ?? note?.title ?? ""}
        />
        <FieldError
          clientError={clientErrors.title}
          serverError={errors.title}
          errorId="title-error"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Kategorie
        </label>
        <select
          {...register("category")}
          id="category"
          className="mt-1 block w-full rounded border p-2"
          defaultValue={
            (formData.get("category") as string) ?? note?.category ?? ""
          }
        >
          {NOTE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <FieldError
          clientError={clientErrors.category}
          serverError={errors.category}
          errorId="category-error"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Inhalt
        </label>
        <textarea
          {...register("content")}
          id="content"
          rows={3}
          className="mt-1 block w-full rounded border p-2"
          defaultValue={
            (formData.get("content") as string) ?? note?.content ?? ""
          }
        ></textarea>
        <FieldError
          clientError={clientErrors.content}
          serverError={errors.content}
          errorId="content-error"
        />
      </div>

      {isPending && <p role="alert">Speichert...</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isPending
          ? "Wird gespeichert..."
          : note
            ? "Notiz bearbeiten"
            : "Notiz speichern"}
      </button>
    </form>
  );
}

type Err = { message?: string } | null | undefined;

function FieldError({
  clientError,
  serverError,
  errorId,
}: {
  clientError: Err;
  serverError: Err;
  errorId: string;
}) {
  const error = clientError ?? serverError;

  if (!error) return null;

  return (
    <div
      id={errorId}
      role="alert"
      className="text-red-600 text-sm font-medium mt-1"
    >
      {error.message}
    </div>
  );
}
