"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ClothingModal from "./clothingModal";

const Slider = ({items}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    {
      heading: "Shirts",
      items: [
        { title: "Shirt 1", image: "sample.png" },
        { title: "Shirt 2", image: "sample.png" },
        { title: "Shirt 3", image: "sample.png" },
        { title: "Shirt 4", image: "sample.png" },
        { title: "Shirt 5", image: "sample.png" },
        { title: "Shirt 6", image: "sample.png" },
        { title: "Shirt 7", image: "sample.png" },
        { title: "Shirt 8", image: "sample.png" },
      ],
    },
    {
      heading: "Pants",
      items: [
        { title: "Pants 1", image: "sample.png" },
        { title: "Pants 2", image: "sample.png" },
        { title: "Pants 3", image: "sample.png" },
        { title: "Pants 4", image: "sample.png" },
        { title: "Pants 5", image: "sample.png" },
        { title: "Pants 6", image: "sample.png" },
        { title: "Pants 7", image: "sample.png" },
        { title: "Pants 8", image: "sample.png" },
        { title: "Pants 9", image: "sample.png" },
        { title: "Pants 10", image: "sample.png" },
      ],
    },
    {
      heading: "Discover",
      items: [
        { title: "Discover 1", image: "sample.png" },
        { title: "Discover 2", image: "sample.png" },
        { title: "Discover 3", image: "sample.png" },
        { title: "Discover 4", image: "sample.png" },
        { title: "Discover 5", image: "sample.png" },
        { title: "Discover 6", image: "sample.png" },
        { title: "Discover 7", image: "sample.png" },
        { title: "Discover 8", image: "sample.png" },
        { title: "Discover 9", image: "sample.png" },
        { title: "Discover 10", image: "sample.png" },
        { title: "Discover 11", image: "sample.png" },
        { title: "Discover 12", image: "sample.png" },
        { title: "Discover 13", image: "sample.png" },
        { title: "Discover 14", image: "sample.png" },
        { title: "Discover 15", image: "sample.png" },
        { title: "Discover 16", image: "sample.png" },
        { title: "Discover 17", image: "sample.png" },
        { title: "Discover 18", image: "sample.png" },
      ],
    },
  ];

  const slideLeft = (rowIndex) => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const slideRight = (rowIndex) => {
    const maxSlides = Math.ceil(categories[rowIndex].items.length / 5) - 1;
    setCurrentSlide((prev) => Math.min(maxSlides, prev + 1));
  };

  return (
    <div className="min-h-screen p-8">
      {categories.map((category, rowIndex) => (
        <div key={category.heading} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{category.heading}</h2>
          <div className="relative group">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {category.items.map((item, index) => (
                  <ClothingModal key={index}>
                    <div className="flex-none w-1/5 px-1 cursor-pointer">
                      <div className="relative group/item">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full rounded-md transform transition-transform duration-300 group-hover/item:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/item:bg-opacity-50 transition-opacity duration-300 rounded-md">
                          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-semibold">
                                {item.title}
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
              onClick={() => slideLeft(rowIndex)}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-4 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => slideRight(rowIndex)}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-4 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              disabled={
                currentSlide === Math.ceil(category.items.length / 5) - 1
              }
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
