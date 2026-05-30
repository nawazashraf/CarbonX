import mongoose from "mongoose";

const retirementSchema = new mongoose.Schema(
{
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    ownerWallet: {
        type: String,
        required: true,
        lowercase: true
    },

    creditsRetired: {
        type: Number,
        required: true
    },

    reason: {
        type: String,
        default: "Carbon Offset"
    },

    certificateId: {
        type: String,
        required: true
    },

    txHash: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

export default mongoose.model(
    "Retirement",
    retirementSchema
);