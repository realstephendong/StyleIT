import React from "react";
import { Button } from "@/components/ui/button";
import { Shirt, User } from "lucide-react";
import { PopoverButton } from "./popoverButton";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 left-0 right-0 bg-white shadow-sm px-4 py-3 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo and Brand Name */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">W</span>
          </div>
          <span className="font-semibold text-lg">Wardrobe</span>
        </div>

        {/* Center: Heading */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-lg font-semibold">
            No fitting rooms, no problem!
          </h1>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon">
            <Shirt />
          </Button>

          <PopoverButton>
            <User />
          </PopoverButton>
        </div>
      </div>
    </nav>
  );
};
