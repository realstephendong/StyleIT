"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";

export default function AddClothes() {
  const [formData, setFormData] = useState({
    type: "",
    imageUrl: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-blue-400">
      {/* Type Field */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="type">Type</Label>
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
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          placeholder="Enter the image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
      </div>

      {/* Price Field */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="price">Price</Label>
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

      {/* Brand Field */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          name="brand"
          placeholder="Enter the brand name"
          value={formData.brand}
          onChange={handleChange}
          required
        />
      </div>

      {/* Submit Button */}
      <Button type="submit">Submit</Button>
    </form>
  );
}
