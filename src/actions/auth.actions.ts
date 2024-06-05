"use server";

import { z } from "zod";
import * as argon2 from "argon2";
import { generateId } from "lucia";
import { cookies } from "next/headers";

import { lucia, validateRequest } from "@/lib/lucia";
import { SignInSchema, SignUpSchema } from "@/types/auth";
import { getRoleByNameService } from "@/lib/services/role.service";
import { createUser, getUserByEmail } from "@/lib/services/user.service";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  try {
    const hashedPassword = await argon2.hash(values.password);
    const userId = generateId(15);

    // Retrieve the ID of the "student" role
    const studentRole = await getRoleByNameService("STUDENT");

    if (!studentRole) {
      return {
        success: false,
        data: null,
        message: "Student role doesn't exist",
      };
    }

    // create user
    await createUser({
      id: userId,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      hashedPassword,
      roleId: studentRole ? studentRole?.id : "",
    });

    const session = await lucia.createSession(userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      data: {
        userId,
      },
      message: "Success create an account",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message,
    };
  }
};

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  try {
    SignInSchema.parse(values);
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: `${error.errors[0].path[0]}: ${error.errors[0].message}`,
    };
  }

  try {
    const existingUser = await getUserByEmail(values.email);

    if (!existingUser) {
      return {
        success: false,
        data: null,
        error: "User not found",
      };
    }

    if (!existingUser.hashedPassword) {
      return {
        success: false,
        data: null,
        error: "User not found",
      };
    }

    const isValidPassword = await argon2.verify(
      existingUser.hashedPassword,
      values.password
    );

    if (!isValidPassword) {
      return {
        success: false,
        data: null,
        error: "Incorrect username or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // todo get from permissions table
    const permissionsData = ["create.user", "read.user"];
    cookies().set({
      name: "permissions",
      value: JSON.stringify(permissionsData),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    return {
      success: true,
      data: null,
      message: "Logged in successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error?.message,
    };
  }
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return {
        success: false,
        data: null,
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    cookies().delete("permissions");
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error?.message,
    };
  }
};
