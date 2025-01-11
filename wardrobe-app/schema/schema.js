import mongoose from "mongoose";

const ClothingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["shirt", "pants", "hat"], // add more types later
  },
  price: Number,
  url: String,
  brand: String,
  name: String,
});

// Prevent duplicate entries based on imagePath
ClothingSchema.index({ url: 1 }, { unique: true });

export default mongoose.models.Clothing ||
  mongoose.model("Clothing", ClothingSchema);
