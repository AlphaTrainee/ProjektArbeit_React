interface HighlightedTextProps {
  text: string;
  highlight: string;
}

export function HighlightedText({ text, highlight }: HighlightedTextProps) {
  if (!highlight.trim()) return <>{text}</>;

  // Escapt Sonderzeichen für die Regex und teilt den Text auf (Case Insensitive 'i')
  const safeHighlight = highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safeHighlight})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={index}
            className="bg-yellow-200 text-black rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
