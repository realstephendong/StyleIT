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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AddWardrobeModal({
  children,
  handleSubmit: originalHandleSubmit,
  name,
  setName,
}) {
  const closeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e) => {
    const { value } = e.target;
    setName(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!name.trim()) {
        throw new Error("Please enter an outfit name");
      }

      await originalHandleSubmit(e);

      toast({
        title: "Success!",
        description: "Your outfit has been added to your wardrobe.",
        variant: "success",
        duration: 1500,
      });

      // Close the modal
      router.push("/wardrobe");
      closeRef.current?.click();
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast({
        title: "Error",
        description: err.message || "Failed to add outfit to wardrobe",
        variant: "destructive",
        duration: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add to Wardrobe
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1 font-semibold">
            Name your new outfit
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Outfit Name
            </Label>
            <Input
              id="name"
              placeholder="eg. Casual Outfit"
              value={name}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
              disabled={isLoading}
            />
          </div>

          <DialogClose ref={closeRef} className="hidden" />

          <Button
            disabled={isLoading}
            type="submit"
            className="relative font-semibold w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
