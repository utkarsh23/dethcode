import * as vscode from "vscode";

import { executeHostCommand } from "./executeHostCommand";
import * as explorer from "./explorer";
import { FileSystem } from "./fs";
import { openContractSource } from "./openContractSource";
import { renderStatusBarItems } from "./statusBar";

let initialized = false;
const fs = FileSystem();

export async function activate(context: vscode.ExtensionContext) {
  fs.register(context);

  if (!initialized) {
    initialized = true;
    void main(context);
  }
}

export function deactivate() {}

async function main(context: vscode.ExtensionContext) {

  const apiName = await detectExplorerApiName();

  vscode.workspace.updateWorkspaceFolders(0, 0, {
    uri: vscode.Uri.parse("memfs:/"),
    name: apiName,
  });

  const address = await executeHostCommand("getContractAddress");

  if (!address) {
    return;
  }

  renderStatusBarItems({
    contractAddress: address,
    contractName: "contract",
    apiName,
  });

  await openContractSource(context, {
    fs,
    apiName,
    address,
  });

  renderStatusBarItems({
    contractAddress: address,
    contractName: "contract",
    apiName,
  });
}

async function detectExplorerApiName(): Promise<explorer.ApiName> {
  const detectedName = await executeHostCommand("getApiName");
  return detectedName as explorer.ApiName;
}
