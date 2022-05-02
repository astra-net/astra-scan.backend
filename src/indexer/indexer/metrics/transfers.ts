import * as RPCClient from "src/indexer/rpc/client";
import { logger } from "src/logger";
import {
  Address,
  Block,
  InternalTransaction,
  RPCStakingTransactionAstra,
  RPCTransaction,
} from "src/types";
import { normalizeAddress } from "src/utils/normalizeAddress";

const l = logger(module);

const undelegateThresholdASTRA = 100000n * 10n ** 18n;
const transferThresholdASTRA = 10000n * 10n ** 18n;
const balanceThresholdASTRA = 1000000n * 10n ** 18n;

const maxTransactionCount = 1;

const maxEntries = 500;
// todo
const maxExcludedEntries = 0;

const entries = new Map();
const excludedAddresses = new Set();
type TType = "staking" | "internal" | "transaction";

const addAddress = async (
  address: Address,
  value: any,
  type: TType,
  blockNumber: number,
  transactionHash: string
) => {
  if (excludedAddresses.has(address) || entries.has(address)) {
    return;
  }

  const balance = await RPCClient.getBalance(0, address);
  if (BigInt(String(balance)) < balanceThresholdASTRA) {
    return;
  }

  const sentTxCount = await RPCClient.getTransactionCount(0, address, "SENT");
  if (+sentTxCount > maxTransactionCount) {
    excludedAddresses.add(address);
    return;
  }

  const payload = {
    address,
    type,
    blockNumber,
    transactionHash,
    balance: BigInt(String(balance)).toString(),
    sentTxCount,
  };

  entries.set(address, payload);
  removeOldEntries();
};

export const addInternalTransaction = (
  internalTransaction: InternalTransaction,
  block: Block
) => {
  try {
    const value = internalTransaction.value;
    if (BigInt(value) < transferThresholdASTRA) {
      return;
    }

    const address = internalTransaction.to;
    addAddress(
      address,
      value,
      "internal",
      +block.number,
      internalTransaction.transactionHash
    );
  } catch (err: any) {
    l.error(err);
  }
};

export const addTransaction = (transaction: RPCTransaction) => {
  try {
    const value = transaction.value;
    if (BigInt(value) < transferThresholdASTRA) {
      return;
    }

    const address = transaction.to;
    addAddress(
      address,
      value,
      "transaction",
      +transaction.blockNumber,
      transaction.hash
    );
  } catch (err: any) {
    l.error(err);
  }
};

export const addStakingTransaction = (
  stakingTransaction: RPCStakingTransactionAstra
) => {
  try {
    if (stakingTransaction.type !== "Undelegate") {
      return;
    }

    const value = stakingTransaction.msg.amount;

    if (BigInt(value) < undelegateThresholdASTRA) {
      return;
    }

    const address = normalizeAddress(stakingTransaction.msg.delegatorAddress);
    addAddress(
      address!,
      value,
      "staking",
      +stakingTransaction.blockNumber,
      stakingTransaction.hash
    );
  } catch (err: any) {
    l.error(err);
  }
};

export const getEntries = () =>
  Array.from(entries.values()).sort((a, b) => b.blockNumber - a.blockNumber);

const removeOldEntries = () => {
  if (entries.size < maxEntries) {
    return;
  }

  const limit = entries.size - maxEntries;

  let i = 0;
  for (const k of entries.keys()) {
    if (i++ > limit) {
      break;
    }
    entries.delete(k);
  }
};

/*

 if (+txCount === 0) {
        const filter: Filter = {
            offset: 0,
            limit: maxTransactionCount + 1,
            orderBy: 'block_number',
            orderDirection: 'desc',
            filters: []
        }

        filter.filters.push({
            value: `'${address}'`,
            type: 'eq',
            property: 'address'
        })

        const storedTxs = await stores[0].address.getRelatedTransactionsByType(address, 'transaction', filter)
        const storedTxCount = storedTxs.length
        console.log({storedTxCount})
        if (storedTxCount > maxTransactionCount) {
            console.log('txCount return')
            // excludedAddresses.add(address)
            // return
        }
    }
*/
