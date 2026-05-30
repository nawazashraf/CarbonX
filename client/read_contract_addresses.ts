import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const CARBON_TOKEN_ADDRESS = "0x97ec276e3833b225a1B16A5A9B51dc99dF90F85b";

const ownableAbi = [
  {
    inputs: [],
    name: "owner",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

async function main() {
  console.log("Connecting to Base Sepolia...");
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  try {
    const owner = await client.readContract({
      address: CARBON_TOKEN_ADDRESS,
      abi: ownableAbi,
      functionName: "owner",
    });
    console.log("CarbonX Contract Owner Address:", owner);
  } catch (error) {
    console.error("Error reading contract owner:", error);
  }
}

main();
