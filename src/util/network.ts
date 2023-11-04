import { NetworkConfig, Method } from '../types';

const buildQueryString = (params: object = {}): string => {
  const queryItems = [];
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      const values = value.join(",")
      queryItems.push(`${key}=${values}`)
    } else if (![null, undefined, ""].includes(value)) {
      queryItems.push(`${key}=${value}`)
    }
  }

  return queryItems.length > 0 ? `?${queryItems.join("&")}` : '';
}

class NetworkInterface {
  #hostname?: string;
  #token?: string;
  #expiredTokenHandler?: () => void;
  #throwOnError?: boolean;

  constructor(hostname?: string, token?: string, expiredTokenHandler?: () => void, throwOnError = false) {
    this.setHostname(hostname);
    if (!this.isTokenExpired(token)) this.setToken(token);
    this.setExpiredTokenHandler(expiredTokenHandler);
    this.#throwOnError = throwOnError;
  }

  setExpiredTokenHandler(callback: () => void): void {
    this.#expiredTokenHandler = callback;
  }

  setThrowOnError(throwOnError?: boolean): void {
    this.#throwOnError = throwOnError
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

    const response = await fetch(`${url}${queryString}`, init);
    const json = await response.json();

    if (!response.ok && this.#throwOnError) {
      throw new Error(json.message);
    }

    return json;
  }
}

export default NetworkInterface;