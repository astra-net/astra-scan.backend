import {storesAPI as stores} from 'src/store'
import {Filter, TransactionQueryField, TransactionQueryValue} from 'src/types/api'
import {ShardID, Transaction} from 'src/types/blockchain'
import {
  is64CharHexHash,
  isBlockNumber,
  isFilters,
  isLimit,
  isOffset,
  isOneOf,
  isOrderBy,
  isOrderDirection,
  isShard,
} from 'src/utils/validators'
import {validator} from 'src/utils/validators/validators'
import {withCache} from './cache'

export async function getTransactionByField(
  shardID: ShardID,
  field: TransactionQueryField,
  value: TransactionQueryValue
): Promise<Transaction | Transaction[] | null> {
  validator({
    field: isOneOf(field, ['block_number', 'block_hash', 'hash', 'hash_astra']),
  })
  if (field === 'block_number') {
    validator({
      value: isBlockNumber(value),
    })
  } else {
    validator({
      value: is64CharHexHash(value),
    })
  }

  const txs = await withCache(['getTransactionByField', arguments], () =>
    stores[shardID].transaction.getTransactionsByField(field, value)
  )

  if (!txs!.length) {
    if (field === 'hash') {
      // if tx not found by hash, give it another shot with astra hash
      return getTransactionByField(shardID, 'hash_astra', value)
    }

    return null
  }

  if (['hash', 'hash_astra'].includes(field)) {
    return txs![0]
  }

  return txs
}

export async function getTransactions(shardID: ShardID, filter?: Filter) {
  validator({
    shardID: isShard(shardID),
  })

  if (filter) {
    validator({
      offset: isOffset(filter.offset),
      limit: isLimit(filter.limit),
      orderBy: isOrderBy(filter.orderBy, ['block_number']),
      orderDirection: isOrderDirection(filter.orderDirection),
      filter: isFilters(filter.filters, ['block_number']),
    })
  } else {
    filter = {
      offset: 0,
      limit: 10,
      orderBy: 'block_number',
      orderDirection: 'desc',
      filters: [],
    }
  }

  return await withCache(
    ['getTransactions', arguments],
    () => stores[shardID].transaction.getTransactions(filter!),
    2000
  )
}
