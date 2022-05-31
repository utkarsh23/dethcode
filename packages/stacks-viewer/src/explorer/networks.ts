/**
 * mapping from StacksCode to API URL
 */
export const explorerApiUrls = {
  mainnet: "https://stacks-node-api.mainnet.stacks.co",
  testnet: "https://stacks-node-api.testnet.stacks.co",
};

export type ApiName = keyof typeof explorerApiUrls;
