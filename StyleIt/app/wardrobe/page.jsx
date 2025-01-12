"use client";
import React, { useState, useEffect } from "react";
import { FilterBar, OutfitCard, OutfitGrid } from "../components/wardrobe";
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
  console.log(outfits);

  return (
    <div className="mx-4 my-2">
      <OutfitGrid outfits={outfits} />
    </div>
  );
};

export default Wardrobe;
