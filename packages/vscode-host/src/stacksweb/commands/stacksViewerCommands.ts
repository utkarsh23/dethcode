export const stacksViewerCommands = {
  getBrowserUrl: () => window.location.href,
  replaceBrowserUrl: (url: string) => window.location.replace(url),
  getContractAddress: (): string | undefined => {
    const url = new URL(window.location.href);

    // surge.sh doesn't seem to support rewrites, so we also read from search params.
    const fromSearchParams = url.searchParams.get("contract");
    if (fromSearchParams?.startsWith("0x")) return fromSearchParams;

    let path = url.pathname.slice(1);

    if (path.startsWith("txid/")) path = path.slice(5);
    if (path.includes("/")) path = path.split('?')[0];

    // The contract is represented by either of the following:
    // a) Transaction ID (eg. 0xd8a9a4528ae833e1894eee676af8d218f8facbf95e166472df2c1a64219b5dfb)
    // b) Contract ID (eg. SP000000000000000000002Q6VF78.bns)
    const checkIfContract = (p: string) => (p.startsWith("0x") || p.includes("."));

    return checkIfContract(path) ? path : undefined;
  },
  getApiName: (): string => {
    const params = new URLSearchParams(window.location.search);
    const chain = params.get("chain");
    if (chain && ["mainnet", "testnet"].includes(chain)) {
      return chain;
    }
    return "mainnet";
  },
  openRepoOnGithub: () => {
    window.open("https://github.com/utkarsh23/stackscode", "_blank");
  },
};

export type StacksViewerCommands = typeof stacksViewerCommands;

export type ExecuteHostCommand = UnionToIntersection<
  {
    [K in keyof StacksViewerCommands]: (
      command: K,
      ...args: Parameters<StacksViewerCommands[K]>
    ) => Thenable<ReturnType<StacksViewerCommands[K]>>;
  }[keyof StacksViewerCommands]
>;

export declare type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
