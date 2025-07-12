import Constants from "expo-constants";
import { resetAccessToken } from "../logout-action";
import WebsocketManager from "./websocket-manager";
import { getDeviceId } from "./application";

let reduxStore, accessToken: string, selectedTeamId: number;
export function setStore(store) {
  reduxStore = store;
  store.subscribe(() => {
    const state = store.getState();
    accessToken = state.accessToken;
    selectedTeamId = null;
    if (state.profile && state.profile.Team) {
      selectedTeamId = state.profile.Team.ID;
    }
  });
}

export function get(url: string, options = {}) {
  options.method = "GET";

  return request(url, options);
}

export function post(url: string, options = {}) {
  options.method = "POST";

  return request(url, options);
}

export function put(url: string, options = {}) {
  options.method = "PUT";

  return request(url, options);
}

export function deleteRequest(url: string, options = {}) {
  options.method = "DELETE";

  return request(url, options);
}

export async function request(url: string, options = {}) {
  const resolvedUrl = resolveUrl(url);
  const finalOptions = await finalizeOptions(options);
  try {
    const res = await fetch(resolvedUrl, finalOptions);
    if (res.status === 401) {
      if (reduxStore) {
        reduxStore.dispatch(resetAccessToken());
      }
    }

    if (res.status >= 400) {
      return Promise.reject(res);
    }

    const data = await res.json();
    res.data = data;
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function createWebsocket(path: string) {
  const deviceId = await getDeviceId();
  const targetUrl = resolveUrl(path == "" ? "ws" : "ws/" + path);
  const protocol = targetUrl.indexOf("http://") === 0 ? "ws" : "wss";
  const endpointWithoutProtocol = targetUrl.split("://", 2)[1];

  let url = protocol + "://" + endpointWithoutProtocol;
  url += url.indexOf("?") >= 0 ? "&" : "?";
  url += "mobileDeviceId=" + encodeURIComponent(deviceId);
  if (accessToken !== null) {
    url += "&accessToken=" + encodeURIComponent(accessToken);
  }

  return new WebsocketManager(url);
}

async function finalizeOptions(options) {
  const deviceId = await getDeviceId();
  options = { ...options };

  if (!options.hasOwnProperty("headers")) {
    options.headers = {};
  }

  if (options.hasOwnProperty("json")) {
    options.body = JSON.stringify(options.json);
    options.headers["Content-Type"] = "application/json";
    delete options.json;
  }

  options.headers["X-Mobile-Device-ID"] = deviceId;
  options.headers["X-App-Version"] = Constants.expoConfig.version;
  options.headers["Accept"] = "application/vnd.pracc.v1+json";
  if (accessToken !== null) {
    options.headers["X-Access-Token"] = accessToken;
  }
  if (selectedTeamId !== null) {
    options.headers["X-Selected-Team-ID"] = selectedTeamId;
  }

  return options;
}

function getEndpoint() {
  let endpoint = "https://pracc.com/api/";
  //let endpoint = process.env.API_ENDPOINT;
  //    endpoint = 'http://192.168.178.85:4333/api/'
  //    endpoint = 'https://pracc.com/api/'
  if (endpoint.slice(-1) !== "/") {
    endpoint += "/";
  }

  return endpoint;
}

function resolveUrl(url) {
  if (url.indexOf("://") >= 0) {
    return url;
  }

  if (url.slice(0, 1) === "/") {
    return getEndpoint() + url.slice(1);
  }

  return getEndpoint() + url;
}
