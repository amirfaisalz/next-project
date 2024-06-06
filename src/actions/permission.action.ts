"use server";

import { z } from "zod";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";

import { PermissionSchema } from "@/types/permission";
import {
  createPermissionService,
  deletePermissionService,
  editPermissionService,
  getAllPermissionService,
  getPermissionByIdService,
} from "@/lib/services/permission.service";

export const getAllPermission = async () => {
  try {
    const permissions = await getAllPermissionService();

    return {
      success: true,
      data: permissions,
      message: "Success get all permissions",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message,
    };
  }
};

export const getPermissionById = async (id: string) => {
  try {
    const role = await getPermissionByIdService(id);

    return {
      success: true,
      data: role,
      message: "Success get one permission",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message,
    };
  }
};

export const createPermission = async (
  values: z.infer<typeof PermissionSchema>
) => {
  try {
    const id = generateId(15);

    const newPermission = await createPermissionService({
      id,
      name: values.name,
      module: values.module,
    });
    revalidatePath("/permissions");

    return {
      success: true,
      data: {
        newPermission,
      },
      message: "Success create a permission",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message,
    };
  }
};

export const editPermission = async ({
  id,
  name,
  module,
}: {
  id: string;
  name: string;
  module: string;
}) => {
  try {
    const newRole = await editPermissionService({
      id,
      name,
      module,
    });
    revalidatePath("/permissions");

    return {
      success: true,
      data: {
        newRole,
      },
      message: "Success edit permission",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message,
    };
  }
};

export const deletePermission = async (id: string) => {
  try {
    await deletePermissionService(id);
    revalidatePath("/permissions");

    return {
      success: true,
      data: null,
      message: "Success delete permission",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message,
    };
  }
};
