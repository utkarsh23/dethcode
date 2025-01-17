import * as vscode from "vscode";

import type {
  ExecuteHostCommand,
  // @ts-ignore - this import won't exist at runtime, we're using it only for better DX
} from "../../vscode-host/src/stacksweb/commands/stacksViewerCommands";

export const executeHostCommand: ExecuteHostCommand = (command, ...args) =>
  vscode.commands.executeCommand<any>(
    `stackscode.vscode-host.${command}`,
    ...args
  );
