import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClothing } from "@/contexts/clothing";

export default function ClothingModal({ brand, type, item, children }) {
  const { setShirts, setPants, setHats } = useClothing();

  const addIfUnique = (prev, item) => {
    return prev.some((existingItem) => existingItem._id === item._id)
      ? prev
      : [...prev, item];
  };

  const handleAddToCart = () => {
    switch (type) {
      case "Shirts":
        setShirts((prev) => addIfUnique(prev, item));
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
          <DialogDescription>{type}</DialogDescription>
        </DialogHeader>

        <img
          src={item.url}
          alt="Image"
          className="w-full h-60 object-contain rounded-md transform transition-transform duration-300 group-hover/item:scale-105"
        />

        <Button type="submit" className="w-full" onClick={handleAddToCart}>
          Add to cart
        </Button>
      </DialogContent>
    </Dialog>
  );
}
