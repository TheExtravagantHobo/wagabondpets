// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Your Account
        </h1>
        <p className="text-gray-600">
          Start managing your pet's health records today
        </p>
      </div>
      
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            formFieldInput: "border-gray-300",
            footerActionLink: "text-blue-600 hover:text-blue-700"
          }
        }}
      />
    </div>
  );
}