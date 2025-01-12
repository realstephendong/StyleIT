"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useClothing } from "@/contexts/clothing";
import React, { useState, useRef } from "react";
import { addClothing } from "../../utils/api";
import { useRouter } from "next/navigation";

export default function AddModal({ children }) {
  const router = useRouter();
  const closeRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First, process the image through the background removal server
      const response = await fetch(
        `http://localhost:3001/remove-background?url=${encodeURIComponent(
          formData.url
        )}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to process image");
      }

      // Get the processed image URL
      const processedImageUrl = data.url;

      // Now create the clothing data with the processed image URL
      const clothingData = {
        ...formData,
        url: processedImageUrl, // Use the processed image URL
        price: parseFloat(formData.price),
      };

      // Submit the clothing data to your database
      await addClothing(clothingData);

      // Reset form after successful submission
      setFormData({
        type: "",
        url: "",
        price: "",
        brand: "",
      });

      router.refresh();

      // Close the modal
      closeRef.current?.click();
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing image or adding clothing item");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Clothing Item</DialogTitle>
          <DialogDescription>
            Add your own clothing item to the collection. Please provide a
            direct image URL.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-2 py-2 text-sm"
              required
            >
              <option value="">Select type</option>
              <option value="Tops">Tops</option>
              <option value="Pants">Pants</option>
              <option value="Hat">Hats</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="url">Image URL</Label>
            <Input
              id="url"
              name="url"
              placeholder="Enter the direct image URL"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter the price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="flex flex-col gap-4 mt-4">
            <Button type="submit">Add Item</Button>
            <DialogClose ref={closeRef} className="hidden" />
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
