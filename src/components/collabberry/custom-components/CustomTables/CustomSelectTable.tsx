import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Table from "@/components/ui/Table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "@/components/ui/Pagination";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Select,
  Tag,
} from "@/components/ui";

type CustomSelectTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  onSubmit: (data: any) => void;
  submitBtnText?: string;
  disabled?: boolean;
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
  onSubmit,
  submitBtnText = "Submit",
  disabled = false,
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

  // Append a third column for assessment status.
  // This column will show "Assessment Submitted" when the row’s contributor
  // has already been reviewed (i.e. row.original.disabled is true).
  const columnsWithSelect = useMemo<ColumnDef<any>[]>(
    () => [
      ...columns,
      {
        header: "",
        id: "assessmentStatus",
        cell: ({ row }) => {
          return row.original.disabled ? (
            // <span className="text-sm text-gray-500 font-semibold">
            //   Assessed ✅
            // </span>
            <Tag className={`text-emerald-500 bg-emerald-50 border-0 h-6`}>
              Assessed
            </Tag>
          ) : null;
        },
      },
    ],
    [columns]
  );

  const table = useReactTable({
    data,
    columns: columnsWithSelect,
    state: {
      rowSelection,
    },
    // Keep previously disabling selection for rows that have already been reviewed.
    enableRowSelection: (row) => {
      return true;
      // if (disabled) return false;
      // return !row.original.disabled;
    },
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
        <THead
          className="!bg-transparent"
          style={{
            border: "none",
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={header.id === "select" ? "select-header" : ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : (
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
        <TBody
          style={{
            border: "none",
          }}
        >
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr
                key={row.id}
                style={{
                  border: "none",
                  cursor: row.getCanSelect() ? "pointer" : "default",
                }}
                className={`${row.getIsSelected()
                  ? "bg-berrylavender-100"
                  : row.getCanSelect()
                    ? ""
                    : "non-hoverable bg-gray-50 opacity-50"
                  }`}
                onClick={() => {
                  if (row.getCanSelect()) {
                    row.toggleSelected();
                  }
                }}
              >
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
      <div className="flex justify-end mt-4">
        <Button
          color="primary"
          disabled={
            table.getSelectedRowModel().rows.length === 0 || disabled
          }
          onClick={() => {
            const data = table
              .getSelectedRowModel()
              .rows.map((row) => row.original);
            onSubmit(data);
          }}
        >
          {submitBtnText}
        </Button>
      </div>
    </>
  );
};

export default CustomSelectTable;