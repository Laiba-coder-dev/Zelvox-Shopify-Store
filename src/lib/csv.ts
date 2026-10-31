/** CSV serialisation (Excel-friendly: UTF-8 BOM, RFC-4180 escaping). */

type Cell = string | number | boolean | null | undefined;

function escapeCell(value: Cell): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function toCsv(rows: Cell[][]): string {
  const body = rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
  return `\uFEFF${body}`;
}

export function csvResponse(filename: string, rows: Cell[][]): Response {
  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
