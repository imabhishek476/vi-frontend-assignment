"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnResizeMode,
    ColumnResizeDirection
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";
import './DataTable.css';
import './indexo.css'
import React from "react";
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>('onChange')

  const [columnResizeDirection, setColumnResizeDirection] =
    React.useState<ColumnResizeDirection>('ltr')
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableMultiRowSelection: false,
        columnResizeMode,
        columnResizeDirection,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        defaultColumn: {
            minSize: 50, //enforced during column resizing
            maxSize: 500, //enforced during column resizing
        },
    });

    // TASK : Make first 2 columns (i.e. checkbox and task id) sticky
    // TASK : Make header columns resizable

    return (
        <div className="space-y-4" >
            <div className="" style={{ direction: table.options.columnResizeDirection }}>
                <Table {...{
              style: {
                width: table.getCenterTotalSize(),
              },
            }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header,index) => {
                                    const stickyClass = index < 2 ? `sticky-col${index === 1 ? '-second' : ''}` : 'else-col';
                                    {console.log(table.getHeaderGroups()[0]?.headers[0])}
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan} className={`${stickyClass} ${header.id==="priority"?"border-r-2":""}`}
                                            style={{ width: `${header.getSize()}px` ,}}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                            <div
                                                {...{
                                                onDoubleClick: () => header.column.resetSize(),
                                                onMouseDown: header.getResizeHandler(),
                                                onTouchStart: header.getResizeHandler(),
                                                className: `resizer ${
                                                    table.options.columnResizeDirection
                                                } ${
                                                    header.column.getIsResizing() ? 'isResizing' : ''
                                                }`,
                                                style: {
                                                    transform:
                                                    columnResizeMode === 'onEnd' &&
                                                    header.column.getIsResizing()
                                                        ? `translateX(${
                                                            (table.options.columnResizeDirection ===
                                                            'rtl'
                                                            ? -1
                                                            : 1) *
                                                            (table.getState().columnSizingInfo
                                                            .deltaOffset ?? 0)
                                                        }px)`
                                                        : '',
                                                },
                                                }}
                                            />
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={row.getToggleSelectedHandler()}
                                >
                                    {row.getVisibleCells().map((cell,index) => {
                                        const stickyClass = index < 2 ? `sticky-col${index === 1 ? '-second' : ''}` : 'else-col';
                                        return(
                                        <TableCell key={cell.id} className={`${stickyClass} ${cell.column.id==="priority"?"border-r-2":""} table-cell`} style={{width:`${cell.column.getSize()}`}}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
