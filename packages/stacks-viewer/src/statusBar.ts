import { StatusBarAlignment, StatusBarItem, Uri, window } from "vscode";

import { apiUrlToWebsite } from "./explorer/apiUrlToWebsite";
import { ApiName, explorerApiUrls } from "./explorer/networks";

export function renderStatusBarItems(
  args:
    | {
        contractAddress: string;
        contractName: string;
        apiName: ApiName;
      }
    | {}
) {
  if ("contractAddress" in args) {
    const { apiName, contractAddress, contractName } = args;
    const link = `https://explorer.stacks.co/txid/${contractAddress}?chain=${apiName}`;

    const tooltip = `Open ${link}`;
    renderStatusBarItem({
      key: "stacks-viewer.explorer-link",
      text: `$(eye) See ${contractName} in the explorer (${contractAddress})`,
      tooltip,
      command: {
        title: "Open on Stacks Explorer",
        command: "vscode.open",
        arguments: [Uri.parse(link)],
      },
      priority: 0,
    });
  }
}

const _renderedItems = new Map<string, StatusBarItem>();

interface RenderStatusBarItemArgs
  extends Pick<StatusBarItem, "text" | "tooltip" | "command">,
    Pick<window.StatusBarItemOptions, "alignment" | "priority"> {
  priority?: number;
  key: string;
}

function renderStatusBarItem(args: RenderStatusBarItemArgs) {
  let item = _renderedItems.get(args.key)!;

  item ||= window.createStatusBarItem(
    args.alignment || StatusBarAlignment.Left,
    args.priority
  );

  item.tooltip = args.tooltip;
  item.text = args.text;
  item.command = args.command;

  item.show();

  _renderedItems.set(args.key, item);

  return item;
}
