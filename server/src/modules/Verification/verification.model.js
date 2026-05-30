import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    verifierWallet: {
      type: String,
      required: true,
    },

    approvedCredits: {
      type: Number,
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },

    txHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Verification =
  mongoose.models.Verification ||
  mongoose.model("Verification", verificationSchema);

export default Verification;
