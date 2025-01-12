"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Minus, Settings, User, MoveRight } from "lucide-react";
import { useClothing } from "@/contexts/clothing";

export function BasketPopover({ children }) {
  const { shirts, pants, hats, setShirts, setPants, setHats, total } =
    useClothing();

  const filterItems = (prev, item) => {
    return prev.filter((prevItem) => prevItem._id !== item._id);
  };

  const handleRemove = (item) => {
    switch (item.type) {
      case "Shirt":
        setShirts((prev) => filterItems(prev, item));
        break;
      case "Pants":
        setPants((prev) => filterItems(prev, item));
        break;
      case "Hat":
        setHats((prev) => filterItems(prev, item));
        break;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          {children}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-bold leading-none ">My Basket</h4>
          </div>

          {total > 0 ? (
            <>
              <div className="grid gap-6">
                {shirts.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold">Shirts</span>
                    {shirts.map((shirt, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between "
                      >
                        <img
                          src={shirt.url}
                          alt={shirt.name}
                          className="w-8 h-8 "
                        />

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(shirt)}
                        >
                          <Minus />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {pants.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold">Pants</span>
                    {pants.map((pant, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between "
                      >
                        <img
                          src={pant.url}
                          alt={pant.name}
                          className="w-8 h-8 rounded"
                        />

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(pant)}
                        >
                          <Minus />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {hats.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold">Hats</span>
                    {hats.map((hat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between "
                      >
                        <img
                          src={hat.url}
                          alt={hat.name}
                          className="w-8 h-8 rounded"
                        />

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(hat)}
                        >
                          <Minus />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/room">
                <Button className="w-full font-semibold">
                  <MoveRight /> Try it on! sdf
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="text-gray-700 font-medium mb-2">
                Your basket is empty
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Add items to your basket to start shopping
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
