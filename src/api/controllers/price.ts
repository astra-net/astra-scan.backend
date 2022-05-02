import { validator } from "src/utils/validators/validators";
import { isOneOf } from "src/utils/validators";
import { withCache } from "src/api/controllers/cache";
import nodeFetch from "node-fetch";

const timeout = () =>
  new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Connection timeout")), 20000)
  );
const call = (url: string) => nodeFetch(url).then((r) => r.json());

const pairs = [
  "ASTRAUSDT",
  "BUSDUSDT",
  "ETHUSDT",
  "LINKUSDT",
  "MAGGOTUSDT",
  "USDTUSDT",
  "UNIUSDT",
  "YFIUSDT",
  "MEMEUSDT",
  "DAIUSDT",
  "USDCUSDT",
  "KEEPUSDT",
  "SUSHIUSDT",
  "ROTUSDT",
  "EMNUSDT",
  "YAMUSDT",
  "BATUSDT",
  "COMPUSDT",
  "WBTCUSDT",
  "KNCUSDT",
  "ZRXUSDT",
  "CROUSDT",
  "AAVEUSDT",
  "RENUSDT",
  "GST2USDT",
  "HGTUSDT",
  "MATICUSDT",
  "SWAGUSDT",
  "BALUSDT",
  "LAYERUSDT",
  "ABYSSUSDT",
  "AMPLUSDT",
  "WETHUSDT",
  "KICKUSDT",
  "FRONTUSDT",
  "SANDUSDT",
  "IDRTUSDT",
  "CELUSDT",
  "PAXGUSDT",
  "UNFIUSDT",
  "UPUSDT",
  "HEXUSDT",
  "STORJUSDT",
  "SMCUSDT",
  "VIUSDT",
  "YFLUSDT",
  "1ASTRAUSDT",
  "ARCDUSDT",
  "UNISTAKEUSDT",
  "COMBOUSDT",
  "HOTUSDT",
  "HTUSDT",
  "TAO$USDT",
  "DSLAUSDT",
  "LOTTOUSDT",
  "MARKUSDT",
  "SRKUSDT",
  "LINAUSDT",
  "DEXEUSDT",
  "ASTRAUSDT",
  "BADGERUSDT",
  "SXPUSDT",
  "SNXUSDT",
  "EBOXUSDT",
  "FTMUSDT",
  "WISEUSDT",
  "AiDAOUSDT",
  "REEFUSDT",
  "dARTUSDT",
  "1INCHUSDT",
  "TUSDUSDT",
  "ROOKUSDT",
  "BUNNYUSDT",
  "TVKUSDT",
  "GRTUSDT",
  "DOGENUSDT",
  "EASYUSDT",
  "LYXeUSDT",
  "LPTUSDT",
  "ENJUSDT",
  "CHAINUSDT",
  "PETRONUSDT",
  "ARCUSDT",
  "MCOUSDT",
  "IMXUSDT",
  "DRCUSDT",
  "FEGUSDT",
  "KISHUUSDT",
  "renBTCUSDT",
  "BNBUSDT",
  "BUSDUSDT",
  "ETHUSDT",
  "USDTUSDT",
  "MOCHIUSDT",
  "ADAUSDT",
  "SAFEMOONUSDT",
  "JulDUSDT",
  "REEFUSDT",
  "BAKEUSDT",
  "CakeUSDT",
  "APESOXUSDT",
  "LINKUSDT",
  "FEGUSDT",
  "APEDOGEUSDT",
  "APESAFEUSDT",
  "USDCUSDT",
  "TWOKUSDT",
  "Mochi-LPUSDT",
  "DAIUSDT",
  "BELUGAUSDT",
  "PIGUSDT",
  "CHIUSDT",
  "SUSHIUSDT",
  "VIPERUSDT",
  "ONXUSDT",
  "NVGUSDT",
  "WBNBUSDT",
  "ElonGateUSDT",
  "ASTRAUSDT",
  "AAVEUSDT",
  "BUSDUSDT",
  "YFIUSDT",
  "1INCHUSDT",
  "UNIUSDT",
  "SNXUSDT",
  "MATICUSDT",
  "1bscBUSDUSDT",
  "1bscMATICUSDT",
  "bBEARUSDT",
  "bDOGENUSDT",
  "1bscMOCHIUSDT",
  "TADUSDT",
  "LAIKAUSDT",
  "DOGEUSDT",
  "BTCBUSDT",
  "WISBUSDT",
  "1bscUSDTUSDT",
  "BUNGAUSDT",
  "JPYCUSDT",
  "ATOMUSDT",
  "USTUSDT",
  "DogeBSCUSDT",
  "11YFIUSDT",
  "1bsc11YFIUSDT",
];

export async function getBinancePairPrice(pair: string): Promise<any | null> {
  validator({
    field: isOneOf(pair, pairs),
  });
  const url = `https://api.binance.com/api/v1/ticker/24hr?symbol=${pair}`;
  return await withCache(
    ["getBinancePairPrice", arguments],
    () => Promise.race([call(url), timeout()]),
    1000 * 60
  );
}

export async function getBinancePairHistoricalPrice(
  pair: string
): Promise<any | null> {
  validator({
    field: isOneOf(pair, pairs),
  });
  const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d`;

  return await withCache(
    ["getBinancePairHistoricalPrice", arguments],
    () => Promise.race([call(url), timeout()]),
    1000 * 60 * 60 * 24
  );
}
