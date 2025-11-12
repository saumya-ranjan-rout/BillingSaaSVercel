import React from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  emptyMessage = "No records found",
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-left font-semibold text-gray-700"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-4 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={(row.id as string) ?? idx}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-gray-50 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-2 text-gray-700">
                    {col.render
                      ? col.render((row as any)[col.key], row)
                      : String((row as any)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
