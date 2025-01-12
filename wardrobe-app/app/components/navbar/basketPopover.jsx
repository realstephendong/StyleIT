"use client";
import { Button } from "@/components/ui/button";
import { Link } from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Minus, Settings, User } from "lucide-react";
import { useClothing } from "@/contexts/clothing";

export function BasketPopover({ children }) {
  const { shirts, pants, hats, setShirts, setPants, setHats } = useClothing();

  const filterItems = (prev, item) => {
    return prev.filter((prevItem) => prevItem._id !== item._id);
  };

  const handleRemove = (item) => {
    console.log(item);
    switch (item.type) {
      case "shirt":
        setShirts((prev) => filterItems(prev, item));
        break;
      case "pants":
        setPants((prev) => filterItems(prev, item));
        break;
      case "hat":
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
            <h4 className="font-medium leading-none">My Basket</h4>
          </div>

          <div className="grid gap-2">
            <div>
              <span className="text-sm">Shirts</span>
              {shirts.map((shirt, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mx-2"
                >
                  <img
                    src={shirt.url}
                    alt={shirt.name}
                    className="w-8 h-8 rounded"
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

            <div>
              <span className="text-sm">Pants</span>
              {pants.map((pant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mx-2"
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

            <div>
              <span className="text-sm">Hats</span>
              {hats.map((hat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mx-2"
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
          </div>

          {/* <Link href="/room"> */}
          <Button className="">Try it on!</Button>
          {/* </Link> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
