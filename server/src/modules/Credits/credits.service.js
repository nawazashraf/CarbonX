import Credit from "./credits.model.js";
import Project from "../Projects/project.model.js";

export const mintCreditsService = async (
    projectId,
    txHash
) => {

    const project =
    await Project.findById(projectId);

    if (!project) {
        throw new Error(
            "Project not found"
        );
    }

    if (!project.verified) {
        throw new Error(
            "Project not verified"
        );
    }

    if (
        project.availableCredits > 0
    ) {
        throw new Error(
            "Credits already minted"
        );
    }

    const credit =
    await Credit.create({

        project: project._id,

        ownerWallet:
        project.ownerWallet,

        amount:
        project.creditsApproved,

        txHash

    });

    project.availableCredits =
    project.creditsApproved;

    await project.save();

    return credit;
};

export const getProjectCreditsService =
async (projectId) => {

    return Credit.find({
        project: projectId
    })
    .sort({
        createdAt: -1
    });
};

export const getWalletCreditsService =
async (wallet) => {

    return Credit.find({
        ownerWallet:
        wallet.toLowerCase()
    })
    .sort({
        createdAt: -1
    });
};