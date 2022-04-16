import {
  commands,
  Disposable,
  ExtensionContext,
  Uri,
  window,
  workspace,
} from "vscode";

import * as explorer from "./explorer";
import {
  FileSystem,
  MemFSTextSearchProvider,
  StaticFileSearchProvider,
} from "./fs";

let fileSearchProviderDisposable: Disposable | undefined;
let textSearchProviderDisposable: Disposable | undefined;

export interface OpenContractSourceArgs {
  fs: FileSystem;
  apiName: explorer.ApiName;
  address: string;
}

export async function openContractSource(
  context: ExtensionContext,
  args: OpenContractSourceArgs
) {
  const { entries, mainFile } = await saveContractFilesToFs(args);

  fileSearchProviderDisposable?.dispose();
  fileSearchProviderDisposable = workspace.registerFileSearchProvider(
    "memfs",
    new StaticFileSearchProvider(entries.map(([path]) => path))
  );
  context.subscriptions.push(fileSearchProviderDisposable);

  textSearchProviderDisposable?.dispose();
  textSearchProviderDisposable = workspace.registerTextSearchProvider(
    "memfs",
    new MemFSTextSearchProvider(entries)
  );
  context.subscriptions.push(textSearchProviderDisposable);

  await showTextDocument(`${mainFile}`);
}

async function saveContractFilesToFs({
  fs,
  address,
  apiName,
}: OpenContractSourceArgs) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  let result = await explorer.fetchFiles(apiName, address);

  const entries = Object.entries(result.files);
  for (const [path, content] of entries) {
    fs.writeFile(path, content);
  }

  return { entries, mainFile: result.mainFile };
}

async function showTextDocument(path: string) {
  // We're trying to open the file even if it doesn't exist yet.
  // Because the following seems to be very slow:
  // // onFileChangeOnce(
  // //   context,
  // //   fs,
  // //   mainFile,
  // //   (e) => void showTextDocument(e.uri.path)
  // // );
  // It's causing some errors in the console, but in the end it provides better UX.
  await window.showTextDocument(
    Uri.from({ scheme: "memfs", path: "/" + path })
  );
  await commands.executeCommand(
    "workbench.files.action.showActiveFileInExplorer"
  );
}
