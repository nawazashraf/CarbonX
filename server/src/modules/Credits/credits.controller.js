import {
    mintCreditsService,
    getProjectCreditsService,
    getWalletCreditsService
}
from "./credits.service.js";

export const mintCredits =
async (req, res) => {

    try {

        const {
            projectId,
            txHash
        } = req.body;

        const credit =
        await mintCreditsService(
            projectId,
            txHash
        );

        return res.status(201)
        .json({
            success: true,
            data: credit
        });

    }
    catch (error) {

        return res.status(400)
        .json({
            success: false,
            message: error.message
        });

    }
};

export const getProjectCredits =
async (req, res) => {

    try {

        const credits =
        await getProjectCreditsService(
            req.params.projectId
        );

        return res.json({
            success: true,
            data: credits
        });

    }
    catch (error) {

        return res.status(500)
        .json({
            success: false,
            message: error.message
        });

    }
};

export const getWalletCredits =
async (req, res) => {

    try {

        const credits =
        await getWalletCreditsService(
            req.params.wallet
        );

        return res.json({
            success: true,
            data: credits
        });

    }
    catch (error) {

        return res.status(500)
        .json({
            success: false,
            message: error.message
        });

    }
};