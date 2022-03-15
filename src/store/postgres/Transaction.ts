import {IStorageTransaction} from 'src/store/interface'
import {buildSQLQuery} from 'src/store/postgres/filters'
import {fromSnakeToCamelResponse, generateQuery} from 'src/store/postgres/queryMapper'
import {Query} from 'src/store/postgres/types'
import {
  Filter,
  RPCTransactionAstra,
  Transaction,
  TransactionQueryField,
  TransactionQueryValue,
} from 'src/types'
import {arrayChunk, defaultChunkSize} from 'src/utils/arrayChunk'

export class PostgresStorageTransaction implements IStorageTransaction {
  query: Query

  constructor(query: Query) {
    this.query = query
  }

  addTransactions = async (txs: RPCTransactionAstra[]) => {
    const chunks = arrayChunk(txs, defaultChunkSize)
    for (const chunk of chunks) {
      await Promise.all(chunk.map((tx: any) => this.addTransaction(tx)))
    }
  }

  addTransaction = async (tx: RPCTransactionAstra) => {
    const newTx = {
      ...tx,
      hash: tx.ethHash,
      hash_astra: tx.hash,
      ethHash: undefined,
      blockNumber: BigInt(tx.blockNumber).toString(),
      value: BigInt(tx.value).toString(),
      gas: BigInt(tx.gas).toString(),
      gasPrice: BigInt(tx.gasPrice).toString(),
    }

    const {query, params} = generateQuery(newTx)
    return await this.query(
      `insert into transactions ${query} on conflict (hash) do nothing;`,
      params
    )
  }

  getTransactionsByField = async (
    field: TransactionQueryField,
    value: TransactionQueryValue
  ): Promise<Transaction[]> => {
    const res = await this.query(`select * from transactions where ${field}=$1;`, [value])
    return res.map(fromSnakeToCamelResponse)
  }

  getTransactions = async (filter: Filter): Promise<Transaction[]> => {
    const q = buildSQLQuery(filter)
    const res = await this.query(`select * from transactions ${q}`, [])

    return res.map(fromSnakeToCamelResponse)
  }
}
