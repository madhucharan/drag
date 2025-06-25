import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <SignedIn>
        <Navbar />
        <Outlet />
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </>
  );
};

export default RootLayout;
