import {
    createProjectService,
    getProjectsService,
    getProjectByIdService
}
from "./project.service.js";

export const createProject =
async (req,res) => {

    try{

        const project =
        await createProjectService(
            req.body
        );

        res.status(201).json({
            success:true,
            data:project
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

export const getProjects =
async (req,res) => {

    try{

        const projects =
        await getProjectsService(
            req.query
        );

        res.status(200).json({
            success:true,
            count:projects.length,
            data:projects
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

export const getProjectById =
async (req,res) => {

    try{

        const project =
        await getProjectByIdService(
            req.params.id
        );

        if(!project){

            return res.status(404).json({
                success:false,
                message:"Project not found"
            });
        }

        res.status(200).json({
            success:true,
            data:project
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};