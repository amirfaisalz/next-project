import db from "@/lib/database";
import { eq } from "drizzle-orm";

import { roleTable } from "../database/schema";

export const getAllRoleService = async () =>
  await db.query.roleTable.findMany();

export const getRoleByIdService = async (id: string) =>
  await db.query.roleTable.findFirst({
    where: eq(roleTable.id, id),
  });

export const getRoleByNameService = async (name: string) =>
  await db.query.roleTable.findFirst({
    where: eq(roleTable.name, name),
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

export const editRoleService = async (values: { id: string; name: string }) =>
  await db
    .update(roleTable)
    .set({
      name: values.name,
    })
    .where(eq(roleTable.id, values.id))
    .returning({
      id: roleTable.id,
    });

export const deleteRoleService = async (id: string) =>
  await db
    .delete(roleTable)
    .where(eq(roleTable.id, id))
    .returning({ id: roleTable.id });
