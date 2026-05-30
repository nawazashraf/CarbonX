import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    verifierWallet: String,

    approvedCredits: Number,

    remarks: String,

    verificationTxHash: String

}, { timestamps: true });

export default mongoose.model(
    "Verification",
    verificationSchema
);