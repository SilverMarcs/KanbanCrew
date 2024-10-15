"use server";

// lib/auth/deleteUser.ts
import { adminAuth } from "../firebaseAdmin";

export async function deleteUser(userId: string) {
  try {
    // Delete user from Firebase Authentication
    await adminAuth.deleteUser(userId);

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user" };
  }
}
