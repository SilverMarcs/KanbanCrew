// lib/createTeamMember.ts
"use server";

import { adminAuth } from "@/lib/firebaseAdmin";

export async function createTeamMember(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password: "password12345", // Consider generating a random password
    });

    return {
      success: true,
      message: "User created successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        firstName,
        lastName,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: "Error creating user" };
  }
}
