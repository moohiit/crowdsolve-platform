import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true }, // Could be geoJSON in future
  image: { 
    url: String, // URL to uploaded image
    public_id: String, // Public ID from Cloudinary
   }, 
  createdAt: { type: Date, default: Date.now },
});

problemSchema.index({ location: "text", title: "text" }); // For search

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
