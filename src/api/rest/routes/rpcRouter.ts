import {NextFunction, Request, Response, Router} from 'express'
import * as controllers from 'src/api/controllers'
import {catchAsync} from 'src/api/rest/utils'
import {EthGetLogParams} from 'src/types'

export const rpcRouter = Router({mergeParams: true})

enum RPCMethod {
  ethGetLogs = 'eth_getLogs',
  astraGetLogs = 'astra_getLogs',
}

enum RPCErrorCode {
  unknownMethod = -32601,
  paramsNotDefined = -32700,
}

rpcRouter.post('/', catchAsync(postRpcRequest))

const wrapRpcResponse = (key: string, value: any) => {
  return {
    jsonrpc: '2.0',
    id: 1,
    [key]: value,
  }
}

export async function postRpcRequest(req: Request, res: Response, next: NextFunction) {
  const {method, params} = req.body

  if (!params || !Array.isArray(params)) {
    return res.send(
      wrapRpcResponse('error', {
        code: RPCErrorCode.paramsNotDefined,
        message: `missing value for required argument 0`,
      })
    )
  }

  try {
    switch (method) {
      case RPCMethod.ethGetLogs:
      case RPCMethod.astraGetLogs: {
        const data = await ethGetLogs(params[0])
        res.send(wrapRpcResponse('result', data))
        break
      }
      default: {
        res.send(
          wrapRpcResponse('error', {
            code: RPCErrorCode.unknownMethod,
            message: `the method ${method} does not exist/is not available`,
          })
        )
      }
    }
  } catch (e: any) {
    res.send(wrapRpcResponse('error', {message: e.message || 'Unknown error'}))
  }
}

function ethGetLogs(params: EthGetLogParams) {
  if (params.fromBlock) {
    params.fromBlock = params.fromBlock.toLowerCase()
  }
  if (params.toBlock) {
    params.toBlock = params.toBlock.toLowerCase()
  }
  return controllers.ethGetLogs(0, params)
}
