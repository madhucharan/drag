import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const AuthenticationPage = ({ type }) => {
  return (
    <>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          {type === "sign-in" ? (
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              forceRedirectUrl="/"
            />
          ) : (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              forceRedirectUrl="/"
            />
          )}
        </div>
      </SignedOut>
    </>
  );
};

export default AuthenticationPage;
