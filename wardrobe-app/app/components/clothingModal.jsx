import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function ClothingModal({ brand, type, item, children }) {
  const handleAddToCart = () => {
    const cartItems = [];
    cartItems.push(item.url);
    console.log(cartItems);
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
          src={"sample.png"}
          alt="Image"
          className="w-full rounded-md transform transition-transform duration-300 group-hover/item:scale-105"
        />

        <Link href="/virtualdressingroom" passHref>
          <Button type="submit" className="w-full" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </Link>
      </DialogContent>
    </Dialog>
  );

