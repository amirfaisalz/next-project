"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleSchema } from "@/types/role";
import Spinner from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createRole, editRole, getRoleById } from "@/actions/role.action";

export default function RoleForm({
  open,
  setOpen,
  formType,
  resetId,
  idToAction,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  formType: "Edit" | "Add";
  resetId?: () => void;
  idToAction?: string;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RoleSchema>) {
    let res;

    if (formType === "Add") {
      res = await createRole(values);
    } else {
      res = await editRole({ id: idToAction as string, name: values.name });
    }

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
    }

    setOpen(false);
    form.setValue("name", "");
    if (resetId) {
      resetId();
    }
  }

  useEffect(() => {
    const getRoleByIdFunc = async () => {
      setLoading(true);
      const role = await getRoleById(idToAction!);
      form.setValue("name", role.data?.name as string);
      setLoading(false);
    };

    if (idToAction) {
      getRoleByIdFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idToAction]);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (!state) {
          form.clearErrors("name");
          form.setValue("name", "");
          if (resetId) {
            resetId();
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{formType} Role</DialogTitle>
            </DialogHeader>

            {loading ? (
              <div className="flex justify-center items-center">
                <Spinner className="h-8 w-8 mt-6 mb-0" />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormControl>
                      <Input placeholder="Insert Role Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="sm:justify-end mt-4">
              <Button
                type="submit"
                variant="secondary"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Working..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
