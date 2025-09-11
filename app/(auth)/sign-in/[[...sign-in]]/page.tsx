// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600">
          Sign in to access your pet's health records
        </p>
      </div>
      
      <SignIn 
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