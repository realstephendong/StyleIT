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
import { Plus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useClothing } from "@/contexts/clothing";
import React, { useState, useRef } from "react";
import { addClothing } from "../../utils/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AddModal({ children }) {
  const router = useRouter();
  const closeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

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
    // Clear error when user starts typing
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate URL
      if (!formData.url.startsWith("http")) {
        throw new Error("Please enter a valid image URL");
      }

      // First, process the image through the background removal server
      const response = await fetch(
        `http://localhost:3001/remove-background?url=${encodeURIComponent(
          formData.url
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to process image");
      }

      // Get the processed image URL
      const processedImageUrl = data.url;

      // Now create the clothing data with the processed image URL
      const clothingData = {
        ...formData,
        url: processedImageUrl,
        price: parseFloat(formData.price),
      };

      // Submit the clothing data to your database
      const result = await addClothing(clothingData);

      // Reset form after successful submission
      setFormData({
        type: "",
        url: "",
        price: "",
        brand: "",
      });

      router.refresh();
      closeRef.current?.click();

      toast({
        title: "Success!",
        description: "Clothing item added successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.message || "Error processing image or adding clothing item"
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add clothing item",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 font-semibold">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Clothing Item
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Add your own clothing item to the collection. Please provide a
            direct image URL.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Type
            </Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={isLoading}
            >
              <option value="">Select type</option>
              <option value="Tops">Tops</option>
              <option value="Pants">Pants</option>
              <option value="Hat">Hats</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              Image URL
            </Label>
            <Input
              id="url"
              name="url"
              placeholder="https://example.com/image.jpg"
              value={formData.url}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price ($)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand" className="text-sm font-medium">
              Brand
            </Label>
            <Input
              id="brand"
              name="brand"
              placeholder="Enter the brand name"
              value={formData.brand}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button disabled={isLoading} type="submit" className="relative">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
            <DialogClose ref={closeRef} className="hidden" />
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isLoading}
                className="border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
