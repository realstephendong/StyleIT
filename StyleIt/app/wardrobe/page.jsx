"use client";
import React, { useState, useEffect } from "react";
import { FilterBar, OutfitCard } from "../components/wardrobe";
import { getOutfits } from "../utils/api";

const Wardrobe = () => {
  const [outfits, setOutfits] = useState([]);

  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    (async () => {
      const data = await getOutfits();
      setOutfits(data);
    })();
  }, []);

  return (
    <div className="mx-4 my-2">
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {outfits.map((outfit, index) => (
          <OutfitCard key={index} outfit={outfit} />
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
