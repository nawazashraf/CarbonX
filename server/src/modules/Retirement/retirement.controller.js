import {
    retireCreditsService,
    getRetirementsService,
    getCertificateService
}
from "./retirement.service.js";

export const retireCredits =
async(req,res)=>{

    try{

        const retirement =
        await retireCreditsService(
            req.body
        );

        res.status(201).json({
            success:true,
            data:retirement
        });

    }catch(error){

        res.status(400).json({
            success:false,
            message:error.message
        });

    }

};

export const getRetirements =
async(req,res)=>{

    try{

        const data =
        await getRetirementsService(
            req.params.wallet
        );

        res.json({
            success:true,
            data
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

export const getCertificate =
async(req,res)=>{

    try{

        const data =
        await getCertificateService(
            req.params.id
        );

        res.json({
            success:true,
            data
        });

    }catch(error){

        res.status(404).json({
            success:false,
            message:error.message
        });

    }

};