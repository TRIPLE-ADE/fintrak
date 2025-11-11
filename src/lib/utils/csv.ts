import * as Papa from "papaparse";

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  return Papa.unparse(rows, {
    quotes: false,
    delimiter: ",",
    newline: "\n",
  });
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


