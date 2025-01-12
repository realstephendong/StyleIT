import mongoose from "mongoose";

const ClothingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Tops", "Pants", "Hat"], // add more types later
  },
  price: Number,
  url: String,
  brand: String,
  name: String,
});

// Prevent duplicate entries based on imagePath
ClothingSchema.index({ url: 1 }, { unique: true });

const WardrobeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  clothes: [ClothingSchema],
});

const Clothing =
  mongoose.models.Clothing || mongoose.model("Clothing", ClothingSchema);
const Wardrobe =
  mongoose.models.Wardrobe || mongoose.model("Wardrobe", WardrobeSchema);

export { Clothing, Wardrobe };
