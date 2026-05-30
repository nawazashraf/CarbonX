import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marketplace",
      required: true,
    },

    buyerWallet: {
      type: String,
      required: true,
      lowercase: true,
    },

    sellerWallet: {
      type: String,
      required: true,
      lowercase: true,
    },

    creditsPurchased: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerCredit: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    txHash: {
      type: String,
      required: true,
      unique: true,
    },

    blockNumber: {
      type: Number,
      default: null,
    },

    network: {
      type: String,
      default: "sepolia",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Transaction", transactionSchema);
