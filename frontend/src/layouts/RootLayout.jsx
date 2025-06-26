import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <SignedIn>
        <div className="min-h-[100vh] w-full">
          <header className="w-full border-b border-gray-200 sticky top-0 z-50 bg-background">
            <div className="max-w-6xl mx-auto px-4 py-3">
              <Navbar />
            </div>
          </header>

          <main className="w-full">
            <div className="max-w-6xl mx-auto px-4 py-3">
              <Outlet />
            </div>
          </main>
        </div>
      </SignedIn>

      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );
};

export default RootLayout;
