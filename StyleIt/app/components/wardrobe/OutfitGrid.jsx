import React from "react";
import OutfitCard from "./OutfitCard";

export const OutfitGrid = ({ outfits }) => (
  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {outfits.map((outfit) => (
      <OutfitCard key={outfit.id} outfit={outfit} />
    ))}
  </div>
);
