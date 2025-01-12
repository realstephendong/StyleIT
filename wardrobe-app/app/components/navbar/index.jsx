"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Shirt, User, ShoppingBag } from "lucide-react";
import { AccountPopover } from "./accountPopover";
import { BasketPopover } from "./basketPopover";
import Link from "next/link";
import { useClothing } from "@/contexts/clothing";

export const Navbar = () => {
  const { total } = useClothing();

  return (
    <nav className="sticky top-0 left-0 right-0 bg-[#f5f5f7] shadow-md px-4 py-5 z-50 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link className="flex items-center space-x-2" href="/">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">W</span>
          </div>
          <span className="font-semibold text-lg">Wardrobe</span>
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-lg font-semibold">
            {/* CHANGE - simple style it */}
            No fitting rooms, no problem!
          </h1>
        </div>

        <div className="flex items-center space-x-6">
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

          <AccountPopover>
            <User />
          </AccountPopover>
        </div>
      </div>
    </nav>
  );
};
