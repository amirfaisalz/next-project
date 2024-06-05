import { getAllPermission } from "@/actions/permission.action";
import PermissionTable from "../__components/permissions/permission.table";

export default async function PermissionPage() {
  const permissions = await getAllPermission();

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl bg-muted-40 w-full">
          Permission
        </h1>
      </div>

      <PermissionTable data={permissions} />
    </>
  );
}
