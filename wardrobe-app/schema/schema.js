import mongoose from "mongoose";

const ClothingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["shirt", "pants"], // add more types later
  },
  imagePath: String,
  price: Number,
  url: String,
  brand: String,
});

// Prevent duplicate entries based on imagePath
ClothingSchema.index({ imagePath: 1 }, { unique: true });

export default mongoose.models.Clothing ||
  mongoose.model("Clothing", ClothingSchema);
