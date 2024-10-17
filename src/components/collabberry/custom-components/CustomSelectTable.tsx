import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Table from "@/components/ui/Table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "@/components/ui/Pagination";
import type { ColumnDef, ColumnSort } from "@tanstack/react-table";
import { Button, Checkbox, CheckboxProps, Select } from "@/components/ui";

type CustomSelectTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
};

type Option = {
  value: number;
  label: string;
};

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>;

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, "onChange"> {
  onChange: (event: CheckBoxChangeEvent) => void;
  indeterminate: boolean;
  onCheckBoxChange?: (event: CheckBoxChangeEvent) => void;
  onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void;
}

const { Tr, Th, Td, THead, TBody } = Table;

function IndeterminateCheckbox({
  indeterminate,
  onChange,
  ...rest
}: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, indeterminate]);

  return <Checkbox ref={ref} onChange={(_, e) => onChange(e)} {...rest} />;
}

const CustomSelectTable = <T,>({
  data,
  columns,
}: CustomSelectTableProps<T>) => {
  const shouldShowPagination = data.length >= 10;
  const totalData = data.length;
  const pageSizeOption = [
    { value: 10, label: "10 / page" },
    { value: 20, label: "20 / page" },
    { value: 30, label: "30 / page" },
    { value: 40, label: "40 / page" },
    { value: 50, label: "50 / page" },
  ];

  const [rowSelection, setRowSelection] = useState({});

  const columnsWithSelect = useMemo<ColumnDef<any>[]>(() => {
    return [
      ...columns,
      {
        id: "select",
        header: ({ table }) => (
          <Button
            color="primary"
            className="min-w-[130px]"
            onClick={() => {
              const isAllSelected = table.getIsAllRowsSelected();
              table.toggleAllRowsSelected(!isAllSelected);
            }}
          >
            {table.getIsAllRowsSelected() ? "Clear" : "Select All"}
          </Button>

          //   <div className="flex flex-row gap-2">
          //     <div>Select All</div>
          //     <IndeterminateCheckbox
          //       {...{
          //         checked: table.getIsAllRowsSelected(),
          //         indeterminate: table.getIsSomeRowsSelected(),
          //         onChange: table.getToggleAllRowsSelectedHandler(),
          //       }}
          //     />
          //   </div>
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
    ];
  }, []);

  const table = useReactTable({
    data,
    columns: columnsWithSelect,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
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
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                (option) =>
                  option.value === table.getState().pagination.pageSize
              )}
              options={pageSizeOption}
              onChange={(option) => onSelectChange(option?.value)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CustomSelectTable;
