import { Event } from "vs/base/common/event";
import { URI, UriComponents } from "vs/base/common/uri";
import { localize } from "vs/nls";
import {
  create,
  IWorkbenchConstructionOptions,
  IWorkspace,
  IWorkspaceProvider,
} from "vs/workbench/workbench.web.api";
import {
  CommandId,
  stacksViewerCommands,
  getCommands,
} from "../../../stacksweb/commands/getCommands";
import { patchForWorkingInIframe } from "../../../stacksweb/in-iframe/patchForWorkingInIframe";

async function main() {
  patchForWorkingInIframe();

  // create workbench
  let config: IWorkbenchConstructionOptions & {
    folderUri?: UriComponents;
    workspaceUri?: UriComponents;
  } = {};

  if ((window as any).product) {
    config = (window as any).product;
  } else {
    const result = await fetch("/product.json");
    config = await result.json();
  }

  if (Array.isArray(config.additionalBuiltinExtensions)) {
    config.additionalBuiltinExtensions.forEach((extension) => {
      extension.extensionLocation = URI.revive(extension.extensionLocation);
    });
  }

  let workspace = undefined;
  if (config.folderUri) {
    workspace = { folderUri: URI.revive(config.folderUri) };
  } else if (config.workspaceUri) {
    workspace = { workspaceUri: URI.revive(config.workspaceUri) };
  }

  if (workspace) {
    const workspaceProvider: IWorkspaceProvider = {
      workspace,
      open: async (
        _workspace: IWorkspace,
        _options?: { reuse?: boolean; payload?: object }
      ) => true,
      trusted: true,
    };
    config = { ...config, workspaceProvider };
  }

  const capitalizeFirstLetter = (string: String) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const apiName = stacksViewerCommands.getApiName();

  create(document.body, {
    ...config,
    commands: getCommands(),
    configurationDefaults: {
      "workbench.colorTheme": "Default Dark+",

      // Omits ${rootName} "Untitled (Workspace)" from the title
      "window.title":
        "${dirty}${activeEditorShort}${separator}${appName}${separator}${remoteName}",
    },
    windowIndicator: {
      onDidChange: Event.None,
      label: localize("playgroundLabel", `$(remote) Stacks ${capitalizeFirstLetter(apiName)}`),
      tooltip: localize("playgroundTooltip", "View Source on GitHub"),
      command: CommandId("openRepoOnGithub"),
    },
  });
}

void main();
