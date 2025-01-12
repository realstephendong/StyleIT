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

export default function ClothingModal({ brand, type, children }) {
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

        <Link href="/room" passHref>
          <Button type="submit" className="w-full">
            Add to cart
          </Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
