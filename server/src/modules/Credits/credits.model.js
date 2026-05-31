import mongoose from "mongoose";

const creditSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    ownerWallet: {
      type: String,
      required: true,
      lowercase: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    txHash: {
      type: String,
    },

    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Credit || mongoose.model("Credit", creditSchema);
