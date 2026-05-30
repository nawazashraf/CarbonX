import Project from "./project.model.js";

export const createProjectService =
async (data) => {

    return await Project.create(data);
};

export const getProjectsService =
async (filters) => {

    const query = {};

    if(filters.category){
        query.category = filters.category;
    }

    if(filters.verified){
        query.verified =
        filters.verified === "true";
    }

    if(filters.search){

        query.$or = [

            {
                name:{
                    $regex:filters.search,
                    $options:"i"
                }
            },

            {
                location:{
                    $regex:filters.search,
                    $options:"i"
                }
            },

            {
                developer:{
                    $regex:filters.search,
                    $options:"i"
                }
            }

        ];
    }

    return await Project.find(query)
    .sort({createdAt:-1});
};

export const getProjectByIdService =
async (id) => {

    return await Project.findById(id);
};