"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addClothing } from "../utils/api";

import { useState } from "react";

export default function AddClothes() {
  const [formData, setFormData] = useState({
    type: "",
    url: "",
    price: "",
    brand: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert price to number since it's stored as string in state
      const clothingData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await addClothing(clothingData);

      // Reset form after successful submission
      setFormData({
        type: "",
        url: "",
        price: "",
        brand: "",
      });

      // Optional: Add success message or redirect
      alert("Clothing item added successfully!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-4 bg-white shadow-xl rounded-lg"
    >
      {/* Type Field */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="type" className="my-2">
          Type
        </Label>
        <Input
          id="type"
          name="type"
          placeholder="Enter the product type"
          value={formData.type}
          onChange={handleChange}
          required
        />
      </div>

      {/* Image URL Field */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="imageUrl" className="my-2">
          URL
        </Label>
        <Input
          id="url"
          name="url"
          placeholder="Enter the URL"
          value={formData.url}
          onChange={handleChange}
          required
        />
      </div>

      {/* Price Field */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="price" className="my-2">
          Price
        </Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="Enter the price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col space-y-1">
        <Label htmlFor="brand" className="my-2">
          Brand
        </Label>
        <Input
          id="brand"
          name="brand"
          placeholder="Enter the brand name"
          value={formData.brand}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
