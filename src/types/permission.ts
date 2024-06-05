import { z } from "zod";

export const PermissionSchema = z.object({
  name: z.string().min(1, { message: "Permission Name is empty" }).max(50),
  module: z.string().min(1, { message: "Module is empty" }).max(50),
});
