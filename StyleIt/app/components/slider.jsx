"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ClothingModal from "./clothingModal";

const getEmoji = (heading) => {
  const emojis = {
    Tops: "👕",
    Pants: "👖",
    Hats: "🧢",
  };
  return emojis[heading] || "👔";
};

const Slider = ({ heading, items }) => {
  return (
    <div className="py-4">
      <h2 className="text-3xl font-bold flex items-center gap-2 mx-8">
        {getEmoji(heading)} {heading}
        <span className="text-sm text-gray-500 ml-2">
          ({items.length} items)
        </span>
      </h2>
      <div className="relative group">
        <div className="flex overflow-x-auto transition-transform duration-500 ease-out p-8 min-h-64 rounded-lg gap-4">
          {items.map((item, index) => (
            <ClothingModal
              brand={item.brand}
              type={heading}
              item={item}
              key={index}
            >
              <div className="flex-none w-[280px] cursor-pointer">
                <div className="relative flex flex-col bg-[#f5f5f7] shadow-xl transform transition-transform duration-200 hover:scale-105 hover:-translate-y-2 rounded-lg overflow-hidden">
                  <div className="h-64 flex items-center justify-center p-2">
                    <img
                      src={item.url}
                      alt={item.brand}
                      className="max-h-full max-w-full object-contain p-4"
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

                  <div className="p-4 border-t bg-white">
                    <h3 className="font-bold text-gray-900">{item.brand}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-gray-600 text-sm">{item.type}</p>
                      <p className="font-semibold text-gray-900">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ClothingModal>
          ))}
        </div>

        {/* Navigation Buttons */}
        {/* <button
          onClick={handlePrev}
          className="absolute cursor-pointer top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          disabled={currentSlide === 0}
        >
          <ChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute cursor-pointer top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          disabled={currentSlide >= Math.ceil(items.length / itemsPerSlide) - 1}
        >
          <ChevronRight />
        </button> */}
      </div>
    </div>
  );
};

export default Slider;
