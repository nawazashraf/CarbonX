import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carbonx";

const marketplaceSchema = new mongoose.Schema({
  contractListingId: Number,
  transactionHash: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  sellerWallet: String,
  creditsListed: Number,
  pricePerCredit: Number,
  status: String,
});

const Marketplace = mongoose.model("Marketplace", marketplaceSchema);

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB.");

  const listings = await Marketplace.find().populate("project");
  console.log("Found listings:", JSON.stringify(listings, null, 2));

  await mongoose.disconnect();
}

main();
