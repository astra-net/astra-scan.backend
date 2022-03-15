import * as RPCClient from 'src/indexer/rpc/client';
(async () => {
  const balance = await RPCClient.getBalance(0, '0xda029b45ad164e2128cedd39380afa34f5af8239')
  console.log({balance})
  console.log(BigInt(String(balance)))
})()
