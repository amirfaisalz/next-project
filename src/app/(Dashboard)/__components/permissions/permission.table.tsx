"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

// import RoleForm from "./role.form";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TPermission } from "@/lib/database/schema";
import { toast } from "@/components/ui/use-toast";
import { deleteRole } from "@/actions/role.action";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/shared/data-table";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { DataTableRowActions } from "@/components/shared/data-table/data-table-row-actions";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import PermissionForm from "./permission.form";

export default function PermissionTable({
  data,
}: {
  data: GlobalReturnDatas<TPermission[] | null>;
}) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [idToAction, setIdToAction] = useState<string | null>(null);

  const column: ColumnDef<TPermission>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "module",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Module" />
      ),
      cell: ({ row }) => <div>{row.getValue("module")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => (
        <DataTableRowActions row={row}>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setIdToAction(row.original.id);
              setOpenEdit(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setIdToAction(row.original.id);
              setOpenDelete(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DataTableRowActions>
      ),
    },
  ];

  const handleDelete = async () => {
    const res = await deleteRole(idToAction!);
    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    } else if (res.success) {
      toast({
        variant: "default",
        description: res.message,
      });
      setOpenDelete(false);
      setIdToAction(null);
    }
  };

  return (
    <>
      <DataTable
        data={data.data!}
        columns={column}
        filter={{
          isSearch: true,
          searchPlaceholder: "Filter permission...",
          searchColumn: "name",
        }}
        addData={{
          isAddData: true,
          placeholder: "Add Permission",
          seeAddData: () => setOpenAdd(true),
        }}
      />
      <PermissionForm
        open={openAdd}
        setOpen={setOpenAdd}
        formType="Add"
        resetId={() => setIdToAction(null)}
      />

      <PermissionForm
        open={openEdit}
        setOpen={setOpenEdit}
        formType="Edit"
        resetId={() => setIdToAction(null)}
        idToAction={idToAction!}
      />
      <DeleteDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title="Permission"
        handleDelete={handleDelete}
        loading={false}
        resetId={() => setIdToAction(null)}
      />
    </>
  );
}
