import { NetworkConfig, Method } from '../types';

const buildQueryString = (params: object = {}): string => {
  const queryItems = [];
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      const values = value.join(",")
      queryItems.push(`${key}=${values}`)
    } else if (value !== "") {
      queryItems.push(`${key}=${value}`)
    }
  }

  return queryItems.length > 0 ? `?${queryItems.join("&")}` : '';
}

class NetworkInterface {
  #hostname?: string;
  #token?: string;
  #expiredTokenHandler?: () => void;

  constructor(hostname?: string, token?: string, expiredTokenHandler?: () => void) {
    this.setHostname(hostname);
    if (!this.isTokenExpired(token)) this.setToken(token);
    this.setExpiredTokenHandler(expiredTokenHandler);
  }

  setExpiredTokenHandler(callback: () => void): void {
    this.#expiredTokenHandler = callback;
  }

  setHostname(hostname?: string): void {
    this.#hostname = hostname;
  }

  getHostname(): string | undefined {
    return this.#hostname;
  }

  setToken(token?: string): void {
    this.#token = token;
  }

  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token ?? this.#token

    if (!tokenToCheck || tokenToCheck.trim() === "") return true;

    const jwtPayload = JSON.parse(atob(tokenToCheck.split('.')[1]))
    return (Date.now() / 1000) >= jwtPayload.exp;
  }

  hasToken() {
    return !!this.#token;
  }

  buildUrl(route?: string): string {
    if (!this.#hostname) return '';
    const routeName = (route && route[0] === "/") ? route.slice(1) : route ?? '';
    return `${this.#hostname}/${routeName}`;
  }

  async run(route: string, config: NetworkConfig = {}): Promise<object> {
    const {
      body = {},
      method = Method.Get,
      params = {},
      token // allows token override for mfaToken
    } = config;

    const tokenToUse = token ?? this.#token;

    if (!!tokenToUse && this.isTokenExpired(tokenToUse)) {
      if (this.#expiredTokenHandler) {
        this.#expiredTokenHandler();
        return new Promise((resolve) => resolve({}));
      } else {
        throw new Error("The authentication token is expired and there is no expired token handler.");
      }
    }

    const url = this.buildUrl(route);
    if (url === "") return new Promise((r) => r({ error: 'No URL specified' }));

    const headers: HeadersInit = new Headers();
    headers.set('Content-Type', 'application/json');
    if (!!tokenToUse) headers.set('Authorization', `Bearer ${tokenToUse}`);

    const init: RequestInit = {
      method,
      headers
    };

    const queryString = buildQueryString(params);

    if (method !== Method.Get) {
      init.body = JSON.stringify(body);
    }

    return fetch(`${url}${queryString}`, init)
      .then((r) => r.json())
  }
}

export default NetworkInterface;