"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ClothingModal from "./clothingModal";

const getEmoji = (heading) => {
  const emojis = {
    'Shirts': '👕',
    'Pants': '👖',
    'Hats': '🧢',
    'Shoes': '👟',
    'Jackets': '🧥',
    // Add more mappings as needed
  };
  return emojis[heading] || '👔'; // Default emoji if heading not found
};

const Slider = ({ heading, items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold px-8 flex items-center gap-2 my-2">
        {getEmoji(heading)} {heading}
        <span className="text-sm text-gray-500 ml-2">({items.length} items)</span>
      </h2>
      <div className="relative group">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out p-8 bg-[#f5f5f7] rounded-lg"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {items.map((item, index) => (
              <ClothingModal
                brand={item.brand}
                type={heading}
                item={item}
                key={index}
              >
                <div className="flex-none w-1/5 px-1 cursor-pointer">
                  <div className="relative flex flex-col bg-white transform transition-transform duration-200 hover:scale-105 hover:-translate-y-2 rounded-lg overflow-hidden">
                    <div className="h-64 flex items-center justify-center p-2">
                      <img
                        src={item.url}
                        alt={item.brand}
                        className="max-h-full max-w-full object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-opacity-0 group-hover/item:bg-opacity-50 transition-opacity duration-300 bg-[#ffffff]">
                        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-white">
                              {item.brand}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Product info section */}
                    <div className="p-4 border-t bg-white">
                      <h3 className="font-medium text-gray-900">{item.brand}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-gray-600 text-sm">{item.type}</p>
                        <p className="font-semibold text-gray-900">${item.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ClothingModal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;