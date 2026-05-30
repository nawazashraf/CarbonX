import {
    getOverviewService,
    getProjectStatsService,
    getMarketplaceStatsService
}
from "./analytics.service.js";

export const getOverview =
async(req,res)=>{

    const data =
    await getOverviewService();

    res.json({
        success:true,
        data
    });

};

export const getProjectStats =
async(req,res)=>{

    const data =
    await getProjectStatsService();

    res.json({
        success:true,
        data
    });

};

export const getMarketplaceStats =
async(req,res)=>{

    const data =
    await getMarketplaceStatsService();

    res.json({
        success:true,
        data
    });

};