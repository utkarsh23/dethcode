import type * as workbench from "vs/workbench/workbench.web.api";
import { StacksViewerCommands } from "./stacksViewerCommands";

export type CommandId = `stackscode.vscode-host.${string}`;

export const CommandId = (id: keyof StacksViewerCommands): CommandId =>
  `stackscode.vscode-host.${id}`;

export interface Command extends workbench.ICommand {
  id: CommandId;
}
