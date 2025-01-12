import React from "react";
import { Button } from "@/components/ui/button";

const OutfitCard = ({ outfit }) => (
  <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition flex flex-col min-h-[400px]">
    <img
      src={outfit.image}
      alt={outfit.title}
      className="w-full h-48 object-cover rounded-md"
    />
    <h2 className="text-xl font-semibold mt-2">{outfit.title}</h2>
    <ul className="text-gray-500 mt-1 flex-grow">
      {outfit.items.map((item, index) => (
        <li key={index}>- {item}</li>
      ))}
    </ul>

    <Button className="mt-auto w-full">Try it out</Button>
  </div>
);

export default OutfitCard;
