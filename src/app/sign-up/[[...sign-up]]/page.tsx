import PublicLayout from "@/components/landing/public-layout";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <SignUp />
      </div>
    </PublicLayout>
  );
}
