import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const CARBON_TOKEN_ADDRESS = "0x97ec276e3833b225a1B16A5A9B51dc99dF90F85b";
const TEST_WALLET = "0x868ef7eab833061ba49ad189bbdb40c2ee274393";

const erc20Abi = [
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
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
    const usdcName = await client.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "name",
    });
    const usdcSymbol = await client.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "symbol",
    });
    const usdcDecimals = await client.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "decimals",
    });
    const usdcBalance = await client.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [TEST_WALLET],
    });

    console.log("USDC Contract Details:");
    console.log(`- Name: ${usdcName}`);
    console.log(`- Symbol: ${usdcSymbol}`);
    console.log(`- Decimals: ${usdcDecimals}`);
    console.log(`- Balance of ${TEST_WALLET}: ${Number(usdcBalance) / 10 ** usdcDecimals} USDC (${usdcBalance.toString()} raw)`);

    const carbonBalance = await client.readContract({
      address: CARBON_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [TEST_WALLET],
    });
    console.log("\nCarbonX Contract Details:");
    console.log(`- Balance of ${TEST_WALLET}: ${Number(carbonBalance) / 1e18} CO2 (${carbonBalance.toString()} raw)`);

  } catch (error) {
    console.error("Error reading contract details:", error);
  }
}

main();
