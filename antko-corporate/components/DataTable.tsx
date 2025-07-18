import { JSX } from "preact";
import { useState } from "preact/hooks";
import { Button } from "./Button.tsx";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => JSX.Element | string;
  width?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  error?: string;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  onRowClick?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (id: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  searchable?: boolean;
  onSearch?: (query: string) => void;
}

export function DataTable({
  data,
  columns,
  loading = false,
  error,
  onSort,
  onRowClick,
  onEdit,
  onDelete,
  pagination,
  searchable = false,
  onSearch
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (column: string) => {
    if (!onSort) return;
    
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort(column, newDirection);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 text-lg mb-2">⚠️ Error Loading Data</div>
        <p class="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div class="bg-white rounded-xl shadow-antko overflow-hidden">
      {/* Header with Search */}
      {searchable && (
        <div class="p-4 border-b border-slate-200">
          <div class="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onInput={(e) => handleSearch(e.currentTarget.value)}
              class="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-antko-blue-500"
            />
            <div class="text-sm text-slate-600">
              {data.length} {data.length === 1 ? 'record' : 'records'}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  class={`px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${
                    column.width ? `w-${column.width}` : ''
                  } ${column.sortable ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div class="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div class="flex flex-col">
                        <div class={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent ${
                          sortColumn === column.key && sortDirection === "asc" 
                            ? "border-b-antko-blue-600" 
                            : "border-b-slate-400"
                        }`} style="border-bottom-width: 4px; margin-bottom: 1px;"></div>
                        <div class={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent ${
                          sortColumn === column.key && sortDirection === "desc" 
                            ? "border-t-antko-blue-600" 
                            : "border-t-slate-400"
                        }`} style="border-top-width: 4px;"></div>
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th class="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            {data.map((row, index) => (
              <tr
                key={index}
                class={`hover:bg-slate-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row.id);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div class="bg-slate-50 px-6 py-4 border-t border-slate-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-600">
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
            </div>
            <div class="flex items-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={pagination.page === 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <span class="px-3 py-1 text-sm text-slate-600">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <Button
                size="sm"
                variant="secondary"
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div class="bg-white rounded-xl shadow-antko overflow-hidden">
      <div class="p-4 border-b border-slate-200">
        <div class="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
      </div>
      <div class="p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} class="flex items-center space-x-4 mb-4">
            <div class="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
            <div class="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
            <div class="h-4 bg-slate-200 rounded w-1/5 animate-pulse"></div>
            <div class="h-4 bg-slate-200 rounded w-1/6 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}