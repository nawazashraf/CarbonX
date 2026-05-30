import Project from "../Projects/project.model.js";
import Verification from "../Verification/verification.model.js";
import Credit from "../Credits/credits.model.js";
import Marketplace from "../Marketplace/marketplace.model.js";
import Retirement from "../Retirement/retirement.model.js";

export const getDashboard = async (req, res) => {
  try {
    const { wallet } = req.params;

    const normalizedWallet = wallet.toLowerCase();

    const projects = await Project.find({
      ownerWallet: normalizedWallet,
    }).sort({ createdAt: -1 });

    const totalProjects = projects.length;

    const verifiedProjects = projects.filter(
      (project) => project.verified,
    ).length;

    const totalCreditsApproved = projects.reduce(
      (sum, project) => sum + project.creditsApproved,
      0,
    );

    const totalAvailableCredits = projects.reduce(
      (sum, project) => sum + project.availableCredits,
      0,
    );

    const retirements = await Retirement.find({
      ownerWallet: normalizedWallet,
    });

    const totalRetiredCredits = retirements.reduce(
      (sum, retirement) => sum + retirement.creditsRetired,
      0,
    );

    const listings = await Marketplace.find({
      sellerWallet: normalizedWallet,
    }).populate("project");

    const activeListings = listings.filter(
      (listing) => listing.status === "active",
    );

    const marketplaceValue = activeListings.reduce(
      (sum, listing) => sum + listing.creditsListed * listing.pricePerCredit,
      0,
    );

    const credits = await Credit.find({
      ownerWallet: normalizedWallet,
    });

    const totalOwnedCredits = credits.reduce((sum, credit) => {
      if (credit.status === "completed") {
        return sum + credit.amount;
      }

      return sum;
    }, 0);

    const latestVerification = await Verification.findOne()
      .populate("projectId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,

      portfolio: {
        totalProjects,
        verifiedProjects,
        totalOwnedCredits,
        totalRetiredCredits,
        totalCreditsApproved,
        totalAvailableCredits,
        marketplaceValue,
      },

      projects,

      listings: activeListings,

      latestVerification,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
