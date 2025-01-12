"use client";
import React, { useState, useEffect } from "react";
import { OutfitCard } from "../components/wardrobe";
import { getOutfits, deleteOutfit } from "../utils/api";
import { useToast } from "@/hooks/use-toast";

const Wardrobe = () => {
  const [outfits, setOutfits] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const { toast } = useToast();

  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    const data = await getOutfits();
    setOutfits(data);
  };

  const handleDelete = async (outfitId) => {
    try {
      await deleteOutfit(outfitId);
      setOutfits(outfits.filter((outfit) => outfit._id !== outfitId));
      toast({
        title: "Outfit deleted",
        description: "The outfit has been removed from your wardrobe.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the outfit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-4 my-2 min-h-screen">
      {/* Header Section */}
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold p-4">Welcome to your wardrobe.</h1>
        <p className="text-lg text-gray-600 mt-2 font-[500]">
          If there are items in your basket, navigate to the dressing room to save an outfit!
        </p>
      </header>
      
      {/* Outfits Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {outfits.map((outfit, index) => (
          <OutfitCard key={index} outfit={outfit} onDelete={handleDelete} />
        ))}
        {!!outfits&&(<div className="text-center"></div>)}
      </div>
    </div>
  );
};

export default Wardrobe;
