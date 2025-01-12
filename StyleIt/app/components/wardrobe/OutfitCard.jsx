import React from "react";
import { Button } from "@/components/ui/button";
import { useClothing } from "@/contexts/clothing";
import { addIfUnique } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const OutfitCard = ({ outfit }) => {
  const router = useRouter();
  const { setTops, setPants, setHats } = useClothing();

  const handleTryOutfit = () => {
    outfit.clothes.forEach((item) => {
      switch (item.type) {
        case "Tops":
          setTops((prev) => addIfUnique(prev, item));
          break;
        case "Pants":
          setPants((prev) => addIfUnique(prev, item));
          break;
        case "Hat":
          setHats((prev) => addIfUnique(prev, item));
          break;
        default:
          break;
      }
      router.push("/room");
    });
  };

  return (
    <div className=" mx-auto bg-white shadow-md rounded-lg p-4 transition flex flex-col w-[350px] min-h-[400px]">
      <h2 className="text-xl font-semibold mt-2">{outfit.name}</h2>

      <div className="flex overflow-x-auto">
        {outfit.clothes.map((item, index) => (
          <div key={index} className="h-64 flex items-center justify-center p-2 w-48">
            <img
              src={item.url}
              alt={item.brand}
              className="max-h-32 max-w-32 object-contain p-4"
            />
          </div>
        ))}
      </div>

      <Button className="mt-auto w-full" onClick={handleTryOutfit}>
        Try it out
      </Button>
    </div>
  );
};
