import LRU from "lru-cache";
import { config } from "src/config";
import { logger } from "src/logger";
const l = logger(module, "cache");

const { isCacheEnabled, cacheMaxSize } = config.api;

const options: LRU.Options<string, any> = {
  max: cacheMaxSize,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

const pruneCheckIntervalMs = 2000;

export const cache = new LRU(options);

export const withCache = async (keys: any[], f: Function, maxAge?: number) => {
  if (!isCacheEnabled) {
    return f();
  }

  const key = JSON.stringify(keys);
  const cachedRes = cache.get(key);
  if (cachedRes) {
    return cachedRes;
  }

  const res = await f();

  // don't cache empty arrays and falsy values. still cache empty objects
  if ((!Array.isArray(res) && res) || (Array.isArray(res) && res.length)) {
    cache.set(key, res, maxAge);
  }

  return res;
};

const prune = () => {
  cache.prune();
  setTimeout(prune, pruneCheckIntervalMs);
};

if (isCacheEnabled) {
  l.info("LRU cache enabled");
  prune();
} else {
  l.debug("LRU cache disabled");
}
