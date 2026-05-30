import mongoose from "mongoose";

const marketplaceSchema = new mongoose.Schema(
{
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    sellerWallet: {
        type: String,
        required: true,
        lowercase: true
    },

    creditsListed: {
        type: Number,
        required: true
    },

    pricePerCredit: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "active",
            "sold",
            "cancelled"
        ],
        default: "active"
    }
},
{
    timestamps: true
});

export default mongoose.model(
    "Marketplace",
    marketplaceSchema
);