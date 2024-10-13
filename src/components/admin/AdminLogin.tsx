"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getDoc, doc } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/lib/firebaseConfig";
import { ForgotPasswordButton } from "../auth/ForgotPasswordButton";

interface AdminLoginProps {
  onLoginSuccess: () => void; // Callback when login succeeds
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch the admin password from Firestore when the component mounts
    const fetchPassword = async () => {
      const docRef = doc(db, "admin", "secret");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAdminPassword(docSnap.data().password);
      } else {
        console.error("No admin password found in Firestore.");
      }
      setLoading(false);
    };

    fetchPassword();
  }, []);

  const handleLogin = () => {
    if (password === adminPassword) {
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  if (loading || adminPassword === null) {
    return <div>Loading...</div>; // Wait for the admin password to load
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-6 w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground ml-1 mb-2">
            Login to continue
          </p>
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full mb-4 ${error ? "border-red-500" : ""}`}
          />
          {error && (
            <p className="text-red-500 text-sm mb-4">
              Incorrect password. Please try again.
            </p>
          )}
          <p className="text-sm text-center text-muted-foreground mb-20">
            <a className="underline">
              <ForgotPasswordButton isAdmin={true}/>
            </a>
          </p>
        </CardContent>
        <CardFooter>
          <Button
            className="bg-primary text-primary-foreground w-full"
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
