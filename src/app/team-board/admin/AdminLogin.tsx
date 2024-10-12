"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you're using ShadCN input component
import { Label } from "@/components/ui/label"; // Assuming ShadCN has a label component
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getDoc, doc } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/lib/firebaseConfig"; // Assuming your firebase config is in lib/firebaseConfig

interface AdminLoginProps {
  onLoginSuccess: () => void; // Callback when login succeeds
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false); // Stop loading after fetching the password
    };

    fetchPassword();
  }, []);

  const handleLogin = () => {
    // Check if the entered password matches the stored admin password from Firestore
    if (password === adminPassword) {
      onLoginSuccess(); // Call the parent component's callback on success
    } else {
      alert("Incorrect password");
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
            className="w-full mb-6"
          />
          <p className="text-sm text-center text-muted-foreground mb-20">
            <a href="#" className="underline">
              Forgot password?
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
