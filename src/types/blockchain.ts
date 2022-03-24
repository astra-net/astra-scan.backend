export type RPCETHMethod =
  | "eth_getBlockByNumber"
  | "eth_getTransactionByHash"
  | "eth_getLogs"
  | "eth_getBlocks"
  | "trace_block"
  | "eth_chainId"
  | "eth_getCode";

export type RPCAstraMethod =
  | "astra_getBlockByNumber"
  | "astra_getTransactionByHash"
  | "astra_getBlocks"
  | "astra_call"
  | "debug_traceTransaction"
  | "astrav2_getTransactionReceipt"
  | "astra_getBalance"
  | "astrav2_getTransactionsCount";

export type ShardID = 0 | 1 | 2 | 3;

export type BytecodeSignatureHash = string;
export type BlockHexNumber = string;
export type BlockHash = string;
export type BlockNumber = number;

export type RPCBlock = {
  difficulty: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: BlockHash;
  logsBloom: LogsBloom;
  miner: string;
  mixHash: string;
  nonce: string;
  number: BlockHexNumber;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: string;
  stateRoot: string;
  timestamp: string;
  transactions: RPCTransaction[];
  transactionsRoot: string;
  uncles: string[];
};

export type LogsBloom = string;

export type RPCBlockAstra = {
  difficulty: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: BlockHash;
  logsBloom: LogsBloom;
  miner: string;
  mixHash: string;
  nonce: string;
  number: BlockHexNumber;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: string;
  stateRoot: string;
  timestamp: string;
  transactions: RPCTransactionAstra[];
  stakingTransactions: RPCStakingTransactionAstra[];
  transactionsRoot: string;
  uncles: string[];
  epoch: string;
  viewID: string;
};

type Modify<T, R> = Omit<T, keyof R> & R;

export type Block = Modify<
  RPCBlockAstra,
  {
    number: BlockNumber;
    epoch: number;
    difficulty: number;
    gasLimit: number;
    gasUsed: number;
    nonce: number;
    size: number;
  }
>;

export type Address = string;
export type AddressAstra = string;

export type TransactionHash = string;
export type TransactionAstraHash = string;

export type RPCTransaction = {
  blockHash: BlockHash;
  blockNumber: BlockHexNumber;
  from: Address;
  to: Address;
  gas: string;
  gasPrice: string;
  hash: TransactionHash;
  input: ByteCode;
  nonce: string;
  r: string;
  s: string;
  timestamp: string;
  transactionIndex: string;
  v: string;
  value: string;
};

export type TransactionReceipt = RPCTransaction & {
  cumulativeGasUsed: string;
  gasUsed: string;
  logs?: [
    {
      data?: string;
    }
  ];
};

export type RPCTransactionAstra = {
  blockHash: BlockHash;
  blockNumber: BlockHexNumber;
  from: AddressAstra;
  to: AddressAstra;
  gas: string;
  gasPrice: string;
  hash: TransactionAstraHash;
  ethHash: TransactionHash;
  input: ByteCode;
  nonce: string;
  r: string;
  s: string;
  shardID: ShardID;
  timestamp: string;
  toShardID: ShardID;
  transactionIndex: string;
  v: string;
  value: string;
};
export type StakingTransactionType =
  | "CreateValidator"
  | "EditValidator"
  | "CollectRewards"
  | "Undelegate"
  | "Delegate";

export type RPCStakingTransactionAstra = {
  type: StakingTransactionType;
  blockHash: BlockHash;
  blockNumber: BlockHexNumber;
  from: AddressAstra;
  to: AddressAstra;
  gas: string;
  gasPrice: string;
  hash: TransactionAstraHash;
  input: ByteCode;
  nonce: string;
  r: string;
  s: string;
  shardID: ShardID;
  timestamp: string;
  toShardID: ShardID;
  transactionIndex: string;
  v: string;
  msg: any; // todo
};

// todo
export type StakingTransaction = RPCStakingTransactionAstra;

export type Topic = string;
export type ByteCode = string;

export type Log = {
  address: Address;
  topics: Topic[];
  data: ByteCode;
  blockNumber: BlockHexNumber;
  transactionHash: TransactionHash;
  transactionIndex: string;
  blockHash: BlockHash;
  logIndex: string;
  removed: boolean;
};

export interface LogDetailed extends Log {
  input: string;
  timestamp: string;
}

export type TraceCallTypes =
  | "call"
  | "staticcall"
  | "create"
  | "create2"
  | "delegatecall"
  | "suicide";

// how to extract see explorer-dashboard
export type TraceCallErrorToRevert = string;

export type RPCInternalTransactionFromBlockTrace = {
  error?: TraceCallErrorToRevert;
  transactionPosition?: number; // index in new rpc versions
  index?: number; // index in old rpc versions
  revert?: string; // hex err message
  result?: {
    address?: Address;
    code?: ByteCode; // deployed bytecode
    gasUsed: string;
    output: ByteCode;
  };
  action: {
    // rpc is not stable
    /*
    curl --location --request POST 'http://52.88.35.21:9500' \
--header 'Content-Type: application/json' \
--data-raw '{
"jsonrpc": "2.0",
  "method": "trace_block",
  "id": 1,
  "params": ["0x34adb5"]
}'
     */
    address?: Address;
    callType: TraceCallTypes;
    from: Address;
    gas: string;
    input: ByteCode;
    to: Address;
    value: string;
    init: ByteCode; // initial bytecode
  };
  blockHash: BlockHash;
  blockNumber: BlockNumber;
  transactionHash: TransactionHash;
  traceAddress: number[];
  type: TraceCallTypes;
};

export type InternalTransaction = {
  error?: TraceCallErrorToRevert;
  index: number;
  from: Address;
  to: Address;
  gas: string;
  gasUsed: string;
  input: ByteCode;
  output: ByteCode;
  time: string;
  type: TraceCallTypes;
  value: string;
  blockHash: BlockHash;
  blockNumber: BlockNumber;
  transactionHash: TransactionHash;
  deployedBytecode?: ByteCode | undefined;
};

export type Transaction = {
  astra: RPCTransactionAstra;
  eth: RPCTransaction;
};

export type AddressTransactionType =
  | "transaction"
  | "staking_transaction"
  | "internal_transaction"
  | "erc20"
  | "erc721";

export type Address2Transaction = {
  blockNumber: BlockNumber;
  transactionHash: TransactionHash | TransactionAstraHash;
  address: Address;
  transactionType: AddressTransactionType;
};

export type Contract = {
  address: Address;
  creatorAddress: Address;
  blockHash: BlockHash;
  blockNumber: BlockNumber;
  transactionHash: TransactionHash;
  IPFSHash?: string;
  solidityVersion?: string;
  meta?: string;
  bytecode: string;
};

export type IERC20 = {
  address: Address;
  decimals: number;
  symbol: string;
  name: string;
  totalSupply?: string;
  circulatingSupply?: string;
  holders?: number;
  transactionCount?: number;
  lastUpdateBlockNumber?: number;
};

export type IERC20Balance = {
  ownerAddress: Address;
  tokenAddress: Address;
  balance: number;
  needUpdate: boolean;
};

export type IERC721 = {
  address: Address;
  symbol: string;
  name: string;
  totalSupply?: string;
  holders?: number;
  transactionCount?: number;
  lastUpdateBlockNumber?: number;
};

export type IERC721Asset = {
  ownerAddress: Address;
  tokenAddress: Address;
  tokenID?: string;
  tokenURI?: string;
  meta?: string;
  needUpdate?: boolean;
  lastUpdateBlockNumber?: number;
};

export type IERC721TokenID = string;

export type BytecodeSignature = {
  hash: BytecodeSignatureHash;
  signatures: string;
};

export type IERC1155 = {
  address: Address;
  symbol: string;
  name: string;
  totalSupply?: string;
  holders?: number;
  transactionCount?: number;
  lastUpdateBlockNumber?: number;
  contractURI?: string;
  meta?: any;
  /*
   meta: {
    name: 'ROTTENSWAP ONE DROP',
    type: '1155',
    symbol: 'VINCI',
    description: 'The most based drop to ever exist on Astra.',
    image: 'QmWSqePh8XnUM3xcrvTg4dYvcuCXHwNuvWFnsSVGHXZQgc',
    external_link: ''
  }
  */
};

export type IERC1155Asset = {
  ownerAddress: Address;
  tokenAddress: Address;
  tokenID?: string;
  tokenURI?: string;
  meta?: string;
  needUpdate?: boolean;
  lastUpdateBlockNumber?: number;
};

export enum ContractEventType {
  Transfer = "Transfer",
  TransferBatch = "TransferBatch",
  TransferSingle = "TransferSingle",
  Approval = "Approval",
  ApprovalForAll = "ApprovalForAll",
}

export type ContractType = "erc20" | "erc721" | "erc1155";

export type ContractEvent = {
  address: string;
  from: string;
  to: string;
  value: string;
  blockNumber: string;
  transactionIndex: string;
  transactionHash: string;
  transactionType: ContractType;
  eventType: ContractEventType;
};
