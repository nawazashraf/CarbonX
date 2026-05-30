import Joi from "joi";

export const retireCreditsValidation =
Joi.object({

    projectId:
    Joi.string().required(),

    creditsRetired:
    Joi.number().positive().required(),

    ownerWallet:
    Joi.string().required(),

    txHash:
    Joi.string().required(),

    reason:
    Joi.string().optional()

});