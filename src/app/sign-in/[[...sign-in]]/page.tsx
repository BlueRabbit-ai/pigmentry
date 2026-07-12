import PublicLayout from "@/components/landing/public-layout";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <SignIn
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/app"
        />
      </div>
    </PublicLayout>
  );
}
