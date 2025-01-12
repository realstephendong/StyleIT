import React from "react";
import { Button } from "@/components/ui/button";
import { useClothing } from "@/contexts/clothing";
import { addIfUnique } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; // Make sure to import this

export const OutfitCard = ({ outfit, onDelete }) => {
  // Add onDelete prop
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

  // console.log(outfit);

  return (
    <div className="mx-auto bg-white shadow-md rounded-lg p-4 transition flex flex-col w-[350px] min-h-[400px] relative">
      {/* Add the delete button */}
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-red-600"
          onClick={() => onDelete(outfit._id)} // Use _id since we're using MongoDB
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <h2 className="text-xl font-semibold mt-2">{outfit.name}</h2>

      <div className="flex flex-col items-center mb-3">
        {outfit.clothes
          .sort((a, b) => {
            const order = { Hat: 1, Tops: 2, Pants: 3 };
            return order[a.type] - order[b.type];
          })
          .map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-2 w-48"
            >
              <img
                src={item.url}
                alt={item.brand}
                className="max-h-32 max-w-32 object-contain px-4"
              />
            </div>
          ))}
      </div>
      <Button
        className="my-2 mt-auto w-full font-semibold"
        onClick={handleTryOutfit}
      >
        Try it out
      </Button>
    </div>
  );
};
