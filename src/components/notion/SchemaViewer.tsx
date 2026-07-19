import type { FormatSchema } from "../../types/content";

export function SchemaViewer({ schema }: { schema: FormatSchema }) {
  return (
    <div className="space-y-2 rounded-xl bg-ivoire-soft p-4">
      <img src={schema.src} alt={schema.alt} className="mx-auto max-w-full" />
      {schema.legendeFalc && <p className="text-sm">{schema.legendeFalc}</p>}
    </div>
  );
}
