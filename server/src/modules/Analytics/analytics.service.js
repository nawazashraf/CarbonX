import Project from "../Projects/project.model.js";
import Credit from "../Credits/credits.model.js";
import Marketplace from "../Marketplace/marketplace.model.js";
import Retirement from "../Retirement/retirement.model.js";

export const getOverviewService =
async()=>{

    const totalProjects =
    await Project.countDocuments();

    const verifiedProjects =
    await Project.countDocuments({
        verified:true
    });

    const totalCreditsMinted =
    await Credit.aggregate([
        {
            $group:{
                _id:null,
                total:{
                    $sum:"$amount"
                }
            }
        }
    ]);

    const totalCreditsRetired =
    await Retirement.aggregate([
        {
            $group:{
                _id:null,
                total:{
                    $sum:"$creditsRetired"
                }
            }
        }
    ]);

    return {

        totalProjects,

        verifiedProjects,

        totalCreditsMinted:
        totalCreditsMinted[0]?.total || 0,

        totalCreditsRetired:
        totalCreditsRetired[0]?.total || 0

    };
};

export const getProjectStatsService =
async()=>{

    return Project.find()
    .select(
        "name category climateScore creditsApproved"
    );

};

export const getMarketplaceStatsService =
async()=>{

    const activeListings =
    await Marketplace.countDocuments({
        status:"active"
    });

    const soldListings =
    await Marketplace.countDocuments({
        status:"sold"
    });

    return {
        activeListings,
        soldListings
    };
};