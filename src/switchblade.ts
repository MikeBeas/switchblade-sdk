import { SwitchbladeSDKParams } from './types';
import Core from './services/core';
import Shortcuts from './services/shortcuts';
import Versions from './services/versions';
import Me from './services/me';
import Setup from './services/setup';
import NetworkInterface from './util/network';

class SwitchbladeSDK {
  #network: NetworkInterface;

  core: Core;
  shortcuts: Shortcuts;
  versions: Versions;
  me: Me;
  setup: Setup;

  constructor(params?: SwitchbladeSDKParams) {
    this.#network = new NetworkInterface(params?.hostname, params?.token, params?.expiredTokenHandler);
    this.#updateNetworkHandlers();
  }

  hasHost(): boolean {
    return !!this.#network.getHostname();
  }

  hasToken(): boolean {
    return !!this.#network.hasToken();
  }

  isTokenExpired(): boolean {
    return this.#network.isTokenExpired();
  }

  setExpiredTokenHandler(callback?: () => void): void {
    this.#network.setExpiredTokenHandler(callback);
    this.#updateNetworkHandlers();
  }

  #updateNetworkHandlers() {
    this.core = new Core(this.#network);
    this.shortcuts = new Shortcuts(this.#network);
    this.versions = new Versions(this.#network);
    this.me = new Me(this.#network);
    this.setup = new Setup(this.#network);
  }

  setHost(hostname: string): void {
    this.#network.setHostname(hostname);
  }

  getHost(): string | undefined {
    return this.#network.getHostname()
  }

  authenticate(token?: string, expiredTokenHandler?: () => void): void {
    this.#network.setToken(token);
    if (expiredTokenHandler) this.setExpiredTokenHandler(expiredTokenHandler);
  }
}

export default SwitchbladeSDK;