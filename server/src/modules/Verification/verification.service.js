import Verification from "./verification.model.js";
import Project from "../Projects/project.model.js";

export const verifyProjectService = async (
    projectId,
    verifierWallet,
    approvedCredits,
    remarks,
    txHash
) => {

    const project =
        await Project.findById(projectId);

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.verified) {
        throw new Error("Project already verified");
    }

    project.verified = true;
    project.creditsApproved = approvedCredits;
    project.availableCredits = 0;

    await project.save();

    const verification =
        await Verification.create({

            projectId,

            verifierWallet,

            approvedCredits,

            remarks,

            txHash

        });

    return verification;
};

export const getVerificationsService =
async () => {

    return await Verification
        .find()
        .populate("projectId");
};