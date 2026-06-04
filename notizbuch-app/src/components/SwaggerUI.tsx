"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Das Überschreiben von console.error erfolgt sofort beim Laden der Datei auf Client-Ebene,
// um das Next.js Error-Overlay für die veralteten Swagger-Komponenten abzufangen.
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const errorMsg = args[0]?.toString() || "";
    if (
      errorMsg.includes("UNSAFE_componentWillReceiveProps") ||
      errorMsg.includes("ParameterRow")
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

// Dynamischer Import ohne SSR umgeht die Server-Client-Hydrierungsfehler
const SwaggerUIReact = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => null,
});

export default function MySwaggerUI({ spec }: { spec: object }) {
  return <SwaggerUIReact spec={spec} />;
}
