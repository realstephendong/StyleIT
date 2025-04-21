"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import ClothingModal from "./clothingModal";
import { deleteClothing } from '../utils/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const getEmoji = (heading) => {
  const emojis = {
    Tops: "👕",
    Pants: "👖",
    Hats: "🧢",
  };
  return emojis[heading] || "👔";
};

const Slider = ({ heading, items }) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteClothing(id);
      toast({
        title: "Success!",
        description: "Clothing item deleted successfully",
        duration: 1000,
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete clothing item",
        duration: 1000,
      });
    }
  };

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
              onDelete={() => handleDelete(item._id)}
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item._id);
                            }}
                            className="text-white hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      </div>
    </div>
  );
};

export default Slider;
