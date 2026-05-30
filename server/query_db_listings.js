import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carbonx";

const projectSchema = new mongoose.Schema({}, { strict: false });
const Project = mongoose.model("Project", projectSchema);

const creditSchema = new mongoose.Schema({}, { strict: false });
const Credit = mongoose.model("Credit", creditSchema);

const marketplaceSchema = new mongoose.Schema({}, { strict: false });
const Marketplace = mongoose.model("Marketplace", marketplaceSchema);

const transactionSchema = new mongoose.Schema({}, { strict: false });
const Transaction = mongoose.model("Transaction", transactionSchema);

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB.");

  const projects = await Project.find();
  console.log("Projects Count:", projects.length);
  console.log("Projects:", JSON.stringify(projects, null, 2));

  const credits = await Credit.find();
  console.log("Credits Count:", credits.length);
  console.log("Credits:", JSON.stringify(credits, null, 2));

  const listings = await Marketplace.find();
  console.log("Listings Count:", listings.length);
  console.log("Listings:", JSON.stringify(listings, null, 2));

  const transactions = await Transaction.find();
  console.log("Transactions Count:", transactions.length);
  console.log("Transactions:", JSON.stringify(transactions, null, 2));

  await mongoose.disconnect();
}

main();
