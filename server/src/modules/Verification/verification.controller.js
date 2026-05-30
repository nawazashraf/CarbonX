import {
    verifyProjectService,
    getVerificationsService
}
from "./verification.service.js";

export const verifyProject =
async (req,res) => {

    try {

        const {
            verifierWallet,
            approvedCredits,
            remarks,
            txHash
        } = req.body;

        const verification =
            await verifyProjectService(

                req.params.projectId,

                verifierWallet,

                approvedCredits,

                remarks,

                txHash

            );

        res.status(200).json({

            success:true,

            message:
            "Project verified successfully",

            data:verification

        });

    } catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }
};

export const getVerifications =
async (req,res) => {

    try {

        const verifications =
            await getVerificationsService();

        res.status(200).json({

            success:true,

            count:verifications.length,

            data:verifications

        });

    } catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }
};