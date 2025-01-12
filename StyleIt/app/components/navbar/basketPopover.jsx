"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2, MoveRight } from "lucide-react";
import { useClothing } from "@/contexts/clothing";

export function BasketPopover({ children }) {
  const { tops, pants, hats, setTops, setPants, setHats, total } =
    useClothing();

  const filterItems = (prev, item) => {
    return prev.filter((prevItem) => prevItem._id !== item._id);
  };

  const handleRemove = (item) => {
    switch (item.type) {
      case "Tops":
        setTops((prev) => filterItems(prev, item));
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
              <div className="grid gap-1">
                {tops.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold">Tops</span>
                    {tops.map((top, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between "
                      >
                        <img
                          src={top.url}
                          alt={top.brand}
                          className="w-8 h-8 object-contain"
                        />
                        <p className="text-black mr-auto ml-4 text-sm">{top.brand}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(top)}
                        >
                          <Trash2 />
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
                          className="w-8 h-8 object-contain"
                        />
                        <p className="text-black mr-auto ml-4 text-sm">
                          {pant.brand}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(pant)}
                        >
                          <Trash2 />
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
                          alt={hat.brand}
                          className="w-8 h-8 object-contain"
                        />
                        <p className="text-black mr-auto ml-4 text-sm">
                          {hat.brand}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(hat)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/room">
                <Button className="w-full font-semibold">
                  Try it on! <MoveRight />
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
                Add items to your basket to try them on
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
