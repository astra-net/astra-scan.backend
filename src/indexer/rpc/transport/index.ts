import { config } from "src/config";
import { logger } from "src/logger";
import { HTTPTransport } from "./http/fetch";
import { WSTransport } from "./ws";

const l = logger(module);

const isHTTP = config.indexer.rpc.transport === "http";
if (config.indexer.isEnabled) {
  l.info(`RPC transport: ${isHTTP ? "HTTP" : "Websocket"}`);
}
export const transport = isHTTP ? HTTPTransport : WSTransport;
