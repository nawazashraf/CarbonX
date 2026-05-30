import crypto from "crypto";

import Retirement from "./retirement.model.js";

import Project from "../Projects/project.model.js";

export const retireCreditsService =
async(data)=>{

    const project =
    await Project.findById(
        data.projectId
    );

    if(!project){
        throw new Error(
            "Project not found"
        );
    }

    if(
        project.availableCredits <
        data.creditsRetired
    ){
        throw new Error(
            "Insufficient credits"
        );
    }

    project.availableCredits -=
    data.creditsRetired;

    await project.save();

    const certificateId =
    crypto.randomUUID();

    return Retirement.create({

        project:
        data.projectId,

        ownerWallet:
        data.ownerWallet,

        creditsRetired:
        data.creditsRetired,

        reason:
        data.reason ||
        "Carbon Offset",

        txHash:
        data.txHash,

        certificateId

    });

};

export const getRetirementsService =
async(wallet)=>{

    return Retirement.find({
        ownerWallet:
        wallet.toLowerCase()
    })
    .populate("project")
    .sort({
        createdAt:-1
    });

};

export const getCertificateService =
async(id)=>{

    const retirement =
    await Retirement.findOne({
        certificateId:id
    })
    .populate("project");

    if(!retirement){
        throw new Error(
            "Certificate not found"
        );
    }

    return retirement;
};