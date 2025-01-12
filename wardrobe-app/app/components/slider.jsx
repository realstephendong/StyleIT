"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ClothingModal from "./clothingModal";

const Slider = ({ heading, items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideLeft = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const slideRight = () => {
    const maxSlides = Math.ceil(items.length / 5) - 1;
    setCurrentSlide((prev) => Math.min(maxSlides, prev + 1));
  };

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
                  <div className="relative h-64 flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.brand}
                      className="max-h-full max-w-full object-contain rounded-md transform transition-transform duration-300 group-hover/item:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/item:bg-opacity-50 transition-opacity duration-300 rounded-md">
                      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
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

        <button
          onClick={slideLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-4 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={slideRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-4 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          disabled={currentSlide === Math.ceil(items.length / 5) - 1}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Slider;
