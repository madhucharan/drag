import { UserButton } from "@clerk/clerk-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mx-auto">
        <NavLink to={"/"} className="text-2xl font-bold text-primary">
          D<span className="text-gray-500">RAG</span>
        </NavLink>
        <div className="flex items-center ">
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
