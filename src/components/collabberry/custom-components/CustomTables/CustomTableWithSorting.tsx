import { useState } from "react";
import Table from "@/components/ui/Table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "@/components/ui/Pagination";
import type { ColumnDef, ColumnSort } from "@tanstack/react-table";
import { Select, Skeleton } from "@/components/ui";
import TFoot from "@/components/ui/Table/TFoot";

type CustomTableWithSortingProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  loadingEnabled?: boolean;
  initialSort?: ColumnSort[];
};

type Option = {
  value: number;
  label: string;
};

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const CustomTableWithSorting = <T,>({
  data,
  columns,
  loadingEnabled = true,
  initialSort,
}: CustomTableWithSortingProps<T>) => {
  const shouldShowPagination = data.length >= 10;
  const totalData = data.length;
  const pageSizeOption = [
    { value: 10, label: "10 / page" },
    { value: 20, label: "20 / page" },
    { value: 30, label: "30 / page" },
    { value: 40, label: "40 / page" },
    { value: 50, label: "50 / page" },
  ];

  const [sorting, setSorting] = useState<ColumnSort[]>(initialSort || []);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1);
  };

  const onSelectChange = (value = 0) => {
    table.setPageSize(Number(value));
  };

  return (
    <>
      {data.length > 0 ? (
        <>
          <Table>
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center"
                                : "flex items-center",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            <div className="flex">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                            {header.column.getCanSort() ? <Sorter sort={header.column.getIsSorted()} /> : null}
                          </div>
                        )}
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </THead>
            <TBody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </TBody>
            <TFoot>
              {table.getFooterGroups().map(group => (
                <Tr key={group.id}>
                  {group.headers.map((header) => {
                    return (
                      <Th key={header.id} colSpan={header.colSpan} className="py-2 px-1 text-start">
                        {flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </TFoot>
          </Table>
          {shouldShowPagination && (
            <div className="flex items-center justify-between mt-4">
              <Pagination
                pageSize={table.getState().pagination.pageSize}
                currentPage={table.getState().pagination.pageIndex + 1}
                total={totalData}
                onChange={onPaginationChange}
              />
              <div style={{ minWidth: 130 }}>
                <Select<Option>
                  size="sm"
                  isSearchable={false}
                  value={pageSizeOption.filter(
                    (option) => option.value === table.getState().pagination.pageSize
                  )}
                  options={pageSizeOption}
                  onChange={(option) => onSelectChange(option?.value)}
                />
              </div>
            </div>
          )}
        </>
      ) : loadingEnabled ? (
        <Skeleton height={300} />
      ) : (
        <div>No data available.</div>
      )
      }
    </>
  );
};

export default CustomTableWithSorting;
