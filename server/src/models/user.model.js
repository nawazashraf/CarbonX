import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },

    companyName: String,

    email: String,

    role: {
        type: String,
        enum: [
            "buyer",
            "project_owner",
            "verifier",
            "admin"
        ],
        default: "buyer"
    },

    totalCreditsOwned: {
        type: Number,
        default: 0
    },

    totalCreditsRetired: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

export default mongoose.model(
    "User",
    userSchema
);