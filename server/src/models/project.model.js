import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({

    contractProjectId: Number,

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: [
            "Forestry",
            "Energy",
            "Ocean",
            "Tech"
        ]
    },

    developer: String,

    imageUrl: String,

    verificationReport: String,

    ownerWallet: {
        type: String,
        required: true
    },

    creditsRequested: Number,

    creditsApproved: {
        type: Number,
        default: 0
    },

    availableCredits: {
        type: Number,
        default: 0
    },

    climateScore: {
        type: Number,
        default: 0
    },

    verified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export default mongoose.model(
    "Project",
    projectSchema
);