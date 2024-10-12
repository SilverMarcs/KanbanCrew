// lib/resetUserPassword.ts
"use server";

import { adminAuth } from "@/lib/firebaseAdmin";

export async function resetUserPassword(userId: string, email: string) {
  try {
    // Reset the user's password
    await adminAuth.updateUser(userId, {
      password: "password12345",
    });

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, message: "Error resetting password" };
  }
}
