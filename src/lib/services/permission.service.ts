import db from "@/lib/database";
import { eq } from "drizzle-orm";

import { permissionTable } from "../database/schema";

export const getAllPermissionService = async () =>
  await db.query.permissionTable.findMany();

export const getPermissionByIdService = async (id: string) =>
  await db.query.permissionTable.findFirst({
    where: eq(permissionTable.id, id),
  });

export const createPermissionService = async (values: {
  id: string;
  name: string;
  module: string;
}) =>
  await db
    .insert(permissionTable)
    .values({
      id: values.id,
      name: values.name,
      module: values.module,
    })
    .returning({
      id: permissionTable.id,
    });

export const editPermissionService = async (values: {
  id: string;
  name: string;
  module: string;
}) =>
  await db
    .update(permissionTable)
    .set({
      name: values.name,
      module: values.module,
    })
    .where(eq(permissionTable.id, values.id))
    .returning({
      id: permissionTable.id,
    });
