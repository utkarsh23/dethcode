import { Command, CommandId } from "./Command";
import { StacksViewerCommands, stacksViewerCommands } from "./stacksViewerCommands";

export { Command, CommandId, stacksViewerCommands };

export function getCommands(): readonly Command[] {
  return Object.entries(stacksViewerCommands).map(([id, handler]) => ({
    id: CommandId(id as keyof StacksViewerCommands),
    handler,
  }));
}
