import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const FilterBar = ({ activeTab, onFilter }) => {
  const filters = ["All", "Tops", "Pants", "Hats"];

  return (
    <div className="p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold my-4">My Wardrobe</h1>

      <div className="flex space-x-4">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant="secondary"
            className={filter === activeTab ? "bg-blue-400" : ""}
            onClick={() => onFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>
    </div>
  );
};
