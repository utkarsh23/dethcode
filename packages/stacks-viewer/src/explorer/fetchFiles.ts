import { assert } from "ts-essentials";

import { fetch as _fetch } from "../util/fetch";
import * as types from "./api-types";
import { ApiName, explorerApiUrls } from "./networks";

interface FetchFilesOptions {
  /**
   * For unit testing.
   * @internal
   */
  fetch?: typeof _fetch;
  /**
   * If more than 0, we fetch implementation contract and merge its files.
   */
  proxyDepth?: number;
}

export function addClarityExtension(fileName: string) {
  return fileName + ".clar";
}

export async function fetchFiles(
  apiName: ApiName,
  transactionId: string,
  { fetch = _fetch }: FetchFilesOptions = {}
): Promise<FetchFileResponse> {
  const apiUrl = explorerApiUrls[apiName];

  let txId = transactionId;
  if (!txId.startsWith("0x") && txId.includes(".")) {
    const txUrl =
      apiUrl
      + "/extended/v1/contract/"
      + transactionId;
    const txResp = await fetch(txUrl) as types.ContractIdResponse;
    txId = txResp.tx_id;
  }

  const url =
    apiUrl
    + "/extended/v1/tx/"
    + txId;
  const response = await fetch(url) as types.TransactionResponse;

  assert(
    response.tx_status === "success",
    "Transaction failed"
  );
  assert(
    response.tx_type === "smart_contract"
    && response.smart_contract,
    "Not a Smart Contract transaction"
  )

  let files: FileContents = {};
  let fileName = addClarityExtension(response.smart_contract.contract_id);
  files[fileName] = response.smart_contract.source_code;

  return { files, mainFile: fileName};
}

interface FetchFileResponse {
  files: FileContents;
  mainFile: string;
}

export interface FileContents
  extends Record<types.FilePath, types.FileContent> {}
