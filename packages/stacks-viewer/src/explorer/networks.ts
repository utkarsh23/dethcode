/**
 * mapping from DethCode subdomain to Etherscan-like API URL
 */
export const explorerApiUrls = {
  mainnet: "https://stacks-node-api.mainnet.stacks.co",
};

export type ApiName = keyof typeof explorerApiUrls;
