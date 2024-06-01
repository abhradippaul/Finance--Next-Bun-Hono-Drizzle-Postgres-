import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

function SignUpPage() {
  return (
    <div className="flex items-center justify-center flex-col gap-y-6 min-h-dvh">
      <h1 className="font-bold text-3xl text-zinc-700">Welcome Back!</h1>
      <p className="text-zinc-900">
        Create account to go to the dashboard
      </p>
      <ClerkLoaded>
        <SignUp />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin text-muted-foreground" />
      </ClerkLoading>
    </div>
  );
}

export default SignUpPage;
