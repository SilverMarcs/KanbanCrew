import { Button } from "@/components/ui/button";

export function ForgotPasswordButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="link"
      className="text-left justify-start px-1 text-xs text-muted-foreground -mt-1"
      onClick={onClick}
    >
      Forgot password?
    </Button>
  );
}