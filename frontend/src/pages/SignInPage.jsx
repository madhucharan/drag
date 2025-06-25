import { SignIn, SignedIn } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const SignInPage = () => (
  <>
    <SignedIn>
      <Navigate to="/" replace />
    </SignedIn>
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      forceRedirectUrl="/"
    />
  </>
);

export default SignInPage;
