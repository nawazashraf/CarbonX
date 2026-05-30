import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
{
    contractProjectId: {
        type: Number,
        default: null
    },

    name: {
        type: String,
        required: true,
        trim: true
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
        ],
        required: true
    },

    developer: {
        type: String,
        required: true
    },

    imageUrl: String,

    verificationReport: String,

    ownerWallet: {
        type: String,
        required: true,
        lowercase: true
    },

    creditsRequested: {
        type: Number,
        required: true
    },

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

},
{
    timestamps: true
});

export default mongoose.model(
    "Project",
    projectSchema
);