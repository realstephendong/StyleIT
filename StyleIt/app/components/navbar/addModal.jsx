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
import { useClothing } from "@/contexts/clothing";

export default function AddModal({ children }) {
  const { setTops, setPants, setHats } = useClothing();

  const handleSubmit = (e) => {};

  return (
    <Dialog className="">
      <DialogTrigger asChild>
        <Plus />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>test</DialogTitle>
          <DialogDescription>testing</DialogDescription>
        </DialogHeader>

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

        <DialogClose asChild>
          <Button
            className="w-full mt-4 shadow-2xl font-semibold"
            onClick={handleAddToCart}
          >
            Add to basket
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
