"use client";

import { useAccount } from "wagmi";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { useMarketplace } from "@/hooks/marketplace/useMarketplace";

export default function DashboardPage() {
  const { address } = useAccount();

  const { data: dashboard, isLoading } = useDashboard(address);
  const { data: marketplace } = useMarketplace();

  if (!address) {
    return <div className="p-10">Connect Wallet</div>;
  }

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  const portfolio = dashboard?.portfolio || {};

  return (
    <div className="p-8 space-y-8">
      {/* STATS */}

      <div className="grid grid-cols-4 gap-4">
        <div className="border p-4 rounded">
          <h3>Total Projects</h3>
          <p>{portfolio.totalProjects}</p>
        </div>

        <div className="border p-4 rounded">
          <h3>Verified Projects</h3>
          <p>{portfolio.verifiedProjects}</p>
        </div>

        <div className="border p-4 rounded">
          <h3>Owned Credits</h3>
          <p>{portfolio.totalOwnedCredits}</p>
        </div>

        <div className="border p-4 rounded">
          <h3>Retired Credits</h3>
          <p>{portfolio.totalRetiredCredits}</p>
        </div>
      </div>

      {/* PROJECTS */}

      <div>
        <h2 className="text-2xl font-bold mb-4">My Projects</h2>

        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Approved</th>
              <th>Available</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {dashboard?.projects?.map((project: any) => (
              <tr key={project._id}>
                <td>{project.name}</td>
                <td>{project.category}</td>
                <td>{project.location}</td>
                <td>{project.creditsApproved}</td>
                <td>{project.availableCredits}</td>
                <td>{project.verified ? "Verified" : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LATEST VERIFICATION */}

      <div className="border rounded p-4">
        <h2 className="font-bold mb-4">Latest Verification</h2>

        {dashboard?.latestVerification ? (
          <>
            <p>Verifier: {dashboard.latestVerification.verifierWallet}</p>

            <p>
              Approved Credits: {dashboard.latestVerification.approvedCredits}
            </p>

            <p>Remarks: {dashboard.latestVerification.remarks}</p>
          </>
        ) : (
          <p>No verification found</p>
        )}
      </div>

      {/* MARKETPLACE */}

      <div>
        <h2 className="text-2xl font-bold mb-4">Marketplace</h2>

        <div className="grid grid-cols-3 gap-4">
          {marketplace?.map((listing: any) => (
            <div key={listing._id} className="border p-4 rounded">
              <h3>{listing.project?.name}</h3>

              <p>Credits: {listing.creditsListed}</p>

              <p>Price: ${listing.pricePerCredit}</p>

              <p>Seller: {listing.sellerWallet}</p>

              <button className="mt-3 border px-4 py-2 rounded">
                Buy Credits
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
