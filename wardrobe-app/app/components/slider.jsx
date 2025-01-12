"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ClothingModal from "./clothingModal";

const Slider = ({ heading, items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{heading}</h2>
      <div className="relative group">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
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
                  <div className="relative h-64 flex items-center justify-center bg-white rounded-md shadow-md transform transition-transform duration-200 hover:scale-110 hover:shadow-xl hover:-translate-y-2 p-2">
                    <img
                      src={item.url}
                      alt={item.brand}
                      className="max-h-full max-w-full object-contain rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/item:bg-opacity-50 transition-opacity duration-300 rounded-md bg-[#ffffff]">
                      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold text-white">
                            {item.brand}
                          </p>
                        </div>
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
