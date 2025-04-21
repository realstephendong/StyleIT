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
import { useClothing } from "@/contexts/clothing";
import { Plus } from "lucide-react";
import { addIfUnique } from "@/lib/utils";
import { useRouter } from "next/router";

export default function ClothingModal({ children, brand, type, item, onDelete }) {
  const { setTops, setPants, setHats } = useClothing();

  const handleAddToCart = () => {
    switch (type) {
      case "Tops":
        setTops((prev) => addIfUnique(prev, item));
        break;
      case "Pants":
        setPants((prev) => addIfUnique(prev, item));
        break;
      case "Hats":
        setHats((prev) => addIfUnique(prev, item));
        break;
      default:
        break;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{brand}</DialogTitle>
          <DialogDescription>
            {type} - ${item.price}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <img
              src={item.url}
              alt={brand}
              className="max-h-64 max-w-full object-contain"
            />
          </div>
          <div className="flex justify-between items-center">
            <Button onClick={onDelete} variant="destructive">
              Delete Item
            </Button>
            <Button onClick={() => window.open(item.url, '_blank')}>
              View Original
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
