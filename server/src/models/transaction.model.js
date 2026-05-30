import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

    buyerWallet: String,

    sellerWallet: String,

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    credits: Number,

    amountPaid: Number,

    txHash: String,

    status: {
        type: String,
        enum: [
            "PENDING",
            "SUCCESS",
            "FAILED"
        ],
        default: "SUCCESS"
    }

}, { timestamps: true });

export default mongoose.model(
    "Transaction",
    transactionSchema
);