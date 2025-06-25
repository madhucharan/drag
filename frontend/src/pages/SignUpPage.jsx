import { SignUp, SignedIn } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const SignUpPage = () => (
  <>
    <SignedIn>
      <Navigate to="/" replace />
    </SignedIn>
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      forceRedirectUrl="/"
    />
  </>
);

export default SignUpPage;
