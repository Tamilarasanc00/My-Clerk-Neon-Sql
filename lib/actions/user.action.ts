"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { CreateUserParams } from "@/types";

export default async function createUser(params: CreateUserParams) {
  try {
    await db.insert(users).values({
      clerkId: params.clerkId,
      email: params.email,
      userName: params.userName,
      age: params.age ?? null,
      mobile_no: params.mobile_no,
      userType: params.userType,
      status: params.status,
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
}
