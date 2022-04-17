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

function getIndicesOf(str: string, searchStr: string) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
      return [];
  }
  var startIndex = 0, index, indices = [];
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + searchStrLen;
  }
  return indices;
}

function getFuncStatements(source: string, funcName: string) {
  let statements = [];
  const useTraitIndices = getIndicesOf(source, funcName);
  for (let index of useTraitIndices) {
    let count = 0;
    while ((index + count) < source.length) {
      count++;
      if (source[index + count] === ")" ) {
        break
      }
    }
    statements.push(source.slice(index, index + count).split(/(\s+)/));
  }
  return statements;
}

function getContracts(source: string, senderAddr: string): types.ContractList {
  let useTraitContracts = [];
  const useTraitStatements = getFuncStatements(source, "use-trait");
  for (let statement of useTraitStatements) {
    const contract = statement[4].split(".");
    if (contract[0] === "") {
      contract[0] = senderAddr;
    } else {
      contract[0] = contract[0].substring(1);
    }
    useTraitContracts.push(contract[0].concat(".", contract[1]));
  }
  let implTraitContracts = [];
  const implTraitStatements = getFuncStatements(source, "impl-trait");
  for (let statement of implTraitStatements) {
    const contract = statement[2].split(".");
    if (contract[0] === "") {
      contract[0] = senderAddr;
    } else {
      contract[0] = contract[0].substring(1);
    }
    implTraitContracts.push(contract[0].concat(".", contract[1]));
  }
  return { useTrait: useTraitContracts, implTrait: implTraitContracts };
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

  const contractList = getContracts(
    response.smart_contract.source_code,
    response.sender_address
  );

  for (let contract of contractList.useTrait) {
    const contractInfoUrl =
      apiUrl
      + "/extended/v1/contract/"
      + contract;
    const contractInfo = await fetch(contractInfoUrl) as types.ContractIdResponse;
    files[addClarityExtension(`use-trait/${contract}`)] = contractInfo.source_code;
  }

  for (let contract of contractList.implTrait) {
    const contractInfoUrl =
      apiUrl
      + "/extended/v1/contract/"
      + contract;
    const contractInfo = await fetch(contractInfoUrl) as types.ContractIdResponse;
    files[addClarityExtension(`impl-trait/${contract}`)] = contractInfo.source_code;
  }

  return { files, mainFile: fileName};
}

interface FetchFileResponse {
  files: FileContents;
  mainFile: string;
}

export interface FileContents
  extends Record<types.FilePath, types.FileContent> {}
