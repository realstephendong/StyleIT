"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Shirt, User, ShoppingBag, Plus } from "lucide-react";
import { AccountPopover } from "./accountPopover";
import { BasketPopover } from "./basketPopover";
import AddModal from "./addModal";
import Link from "next/link";
import { useClothing } from "@/contexts/clothing";

export const Navbar = () => {
  const { total } = useClothing();

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white shadow-md px-4 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link className="flex items-center space-x-2" href="/">
          <img
            src="https://i.imgur.com/wbPl7TC.png"
            alt="StyleIt"
            className="w-8 h-8 object-contain ml-2"
          />
          <span className="font-semibold text-lg">StyleIT.</span>
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-lg font-semibold">Got a minute? Style it!</h1>
        </div>
        

        <div className="flex items-center space-x-6 relative">
          <BasketPopover>
            <div className="relative">
              <ShoppingBag />
              {total > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {total}
                </span>
              )}
            </div>
          </BasketPopover>

          <Button variant="ghost" size="icon">
            <Shirt />
          </Button>
        </div>
      </div>
    </nav>
  );
};
