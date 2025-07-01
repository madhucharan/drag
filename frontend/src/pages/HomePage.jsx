import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Get started with DRAG</h2>
        <Button asChild>
          <Link to={"/api-keys"}>Manage API Keys</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
