import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  searchable?: boolean;
}

interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  filterColumn?: {
    key: keyof T | string;
    options: string[];
    label: string;
  };
}

export default function DataGrid<T extends { id: any }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  filterColumn,
}: DataGridProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle Sort Toggle
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Process data (Search -> Filter -> Sort)
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const searchableKeys = columns
        .filter((c) => c.searchable !== false)
        .map((c) => c.key);

      result = result.filter((item) => {
        return searchableKeys.some((key) => {
          const val = (item as any)[key];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(query);
        });
      });
    }

    // Filter
    if (filterColumn && filterValue !== "all") {
      result = result.filter(
        (item) => String((item as any)[filterColumn.key]) === filterValue
      );
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const valA = (a as any)[sortKey];
        const valB = (b as any)[sortKey];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortDirection === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }

    return result;
  }, [data, columns, searchQuery, filterColumn, filterValue, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage]);

  const onPrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const onNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  // Reset pagination on filter or search
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filterValue]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/10 focus:border-primary text-gray-800 dark:text-gray-100 transition-all duration-150"
          />
        </div>

        {filterColumn && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {filterColumn.label}:
            </span>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="text-xs font-semibold bg-white/50 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/10 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <option value="all">All</option>
              {filterColumn.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200/50 dark:border-gray-800/30 shadow-inner bg-white/20 dark:bg-gray-900/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200/40 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-800/30">
              {columns.map((col) => (
                <th
                  key={col.key.toString()}
                  onClick={() => col.sortable !== false && handleSort(col.key.toString())}
                  className={`px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none ${
                    col.sortable !== false ? "cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable !== false && (
                      <span className="text-gray-400 dark:text-gray-600">
                        {sortKey === col.key.toString() ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/30">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-100/30 dark:hover:bg-gray-800/10 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td key={col.key.toString()} className="px-6 py-3.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-xs font-medium text-gray-400 dark:text-gray-500"
                >
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Page <span className="text-gray-800 dark:text-gray-200">{currentPage}</span> of{" "}
            <span className="text-gray-800 dark:text-gray-200">{totalPages}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="p-1.5 border border-gray-200/50 dark:border-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-gray-200/50 dark:border-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
