import { useState } from "react";
import { Button } from "../ui/button";
import CreateAccountForm from "./CreateAccountForm";
import GoogleSignInButton from "./GoogleSignInButton";
import SignInForm from "./SignInForm";

export function AuthenticationSection() {
  const [isCreateAccount, setIsCreateAccount] = useState(false);

  return (
    <div className="w-full lg:w-1/2 bg-card flex items-center justify-center p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isCreateAccount ? "Create an account" : "Login"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isCreateAccount
              ? "Enter your details below to create your account"
              : "Enter your email to sign in to your account"}
          </p>
        </div>
        {isCreateAccount ? <CreateAccountForm /> : <SignInForm />}
        <GoogleSignInButton />
        <Button
          variant="link"
          onClick={() => setIsCreateAccount(!isCreateAccount)}
        >
          {isCreateAccount ? "Back to Sign In" : "Create Account"}
        </Button>
      </div>
    </div>
  );
}
