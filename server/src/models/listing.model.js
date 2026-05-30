import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({

    listingId: Number,

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },

    sellerWallet: String,

    amount: Number,

    pricePerCredit: Number,

    totalPrice: Number,

    status: {
        type: String,
        enum: [
            "ACTIVE",
            "SOLD",
            "CANCELLED"
        ],
        default: "ACTIVE"
    },

    txHash: String

}, { timestamps: true });

export default mongoose.model(
    "Listing",
    listingSchema
);