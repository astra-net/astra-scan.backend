import { RPCTransactionAstra } from "src/types";

// 0xe677087b220fa3a5a33c24f1fbb1bdd6ffa205895bf823b679ee9afaad52052f
// '0xe5546f37000000000000000000000000000000000000000000000------0-------00000000000000000000000000000-------------9-c--6---------------3-----000000000000000000000000cf664087a5bb0237a0bad6742852ec6c8d69a27a0000000000000000000000007d02c116b98d0965ba7b642ace0183ad8b8d2196000000000000000000000000f012702a5f0e54015362cbca26a26fc90aa832a3000000000000000000000000-------c----9-------------------------0-000000000000000000000000------5----------------------f----6-----000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000---------------33-----------------a-----0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000-------------9-c--6---------------3-----000000000000000000000000cf664087a5bb0237a0bad6742852ec6c8d69a27a'
const arbitrage = (tx: RPCTransactionAstra) => {
  const { input } = tx;
  if (!input || input.length !== 1098) {
    return true;
  }

  if (input.indexOf("0xe5546f37") === 0) {
    return false;
  }

  return true;
};

export const internalTransactionsIgnoreList = [arbitrage];

export const internalTransactionsIgnoreListFilter = (
  tx: RPCTransactionAstra
) => {
  return internalTransactionsIgnoreList.reduce((a, b) => b(tx) && a, true);
};
