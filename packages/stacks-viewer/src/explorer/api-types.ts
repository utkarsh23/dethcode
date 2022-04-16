export type FilePath = string;

export type FileContent = string;

export type File = { content: FileContent };

export interface TransactionResponse {
  tx_id: string;
  tx_status: string;
  tx_type: string;
  smart_contract?: ContractInfo;
}

export interface ContractIdResponse {
  tx_id: string;
}

export interface ContractInfo {
  source_code: string;
  contract_id: string;
}
