import mongoose from "mongoose";

const retirementSchema = new mongoose.Schema({

    walletAddress: String,

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    creditsRetired: Number,

    certificateNumber: String,

    txHash: String

}, { timestamps: true });

export default mongoose.model(
    "Retirement",
    retirementSchema
);