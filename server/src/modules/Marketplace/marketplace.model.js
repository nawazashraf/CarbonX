import mongoose from "mongoose";

const marketplaceSchema = new mongoose.Schema(
  {
    contractListingId: {
      type: Number,
      default: null,
    },

    transactionHash: {
      type: String,
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    sellerWallet: {
      type: String,
      required: true,
      lowercase: true,
    },

    creditsListed: {
      type: Number,
      required: true,
    },

    pricePerCredit: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "sold", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const Marketplace =
  mongoose.models.Marketplace ||
  mongoose.model("Marketplace", marketplaceSchema);

export default Marketplace;
