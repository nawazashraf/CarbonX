import Joi from "joi";

export const mintCreditsValidation = Joi.object({
    projectId: Joi.string()
        .required()
});