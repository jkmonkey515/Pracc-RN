import { createWebsocket } from "./backend";
import WebsocketManager from "./websocket-manager";

let websocketInstance = null;

export function getWebsocketInstance() {
  if (!websocketInstance) {
    websocketInstance = createWebsocket("");
  }
  return websocketInstance;
}
