// src/utils/csv.ts
type ExportCsvOptions = {
    delimiter?: string;         // por defecto ",", usa "|" para pipes
    filename?: string;          // sin extensión o con .csv
    includeExcelSepHint?: boolean; // agrega "sep=|" para Excel
    columns?: string[];         // si quieres ordenar/limitar columnas
};

export function exportCSV<T extends Record<string, any>>(
    rows: T[],
    options: ExportCsvOptions = {}
) {
    const {
        delimiter = ",",
        filename = "export",
        includeExcelSepHint = true,
        columns,
    } = options;

    if (!rows || rows.length === 0) return;

    const headers = columns?.length ? columns : Object.keys(rows[0]);

    const escapeValue = (value: unknown) => {
        if (value === null || value === undefined) return "";
        const str = String(value);
        // CSV estándar: comillas dobles para envolver, y escapar comillas internas
        return `"${str.replace(/"/g, '""')}"`;
    };

    const lines: string[] = [];

    // Hint para Excel para que use el separador correcto
    if (includeExcelSepHint) {
        lines.push(`sep=${delimiter}`);
    }

    lines.push(headers.join(delimiter));

    for (const row of rows) {
        lines.push(headers.map((h) => escapeValue(row[h])).join(delimiter));
    }

    const csvContent = lines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
