import db from "@/lib/database";
import { eq } from "drizzle-orm";

import { roleTable } from "../database/schema";

export const getAllRoleService = async () =>
  await db.query.roleTable.findMany();

export const getRoleByIdService = async (id: string) =>
  await db.query.roleTable.findFirst({
    where: eq(roleTable.id, id),
  });

export const createRoleService = async (values: { id: string; name: string }) =>
  await db
    .insert(roleTable)
    .values({
      id: values.id,
      name: values.name,
    })
    .returning({
      id: roleTable.id,
    });

export const deleteRoleService = async (id: string) =>
  await db
    .delete(roleTable)
    .where(eq(roleTable.id, id))
    .returning({ id: roleTable.id });
