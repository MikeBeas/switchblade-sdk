import { Method, ShortcutParams, ShortcutSearchParams } from '../types';
import NetworkInterface from '../util/network';

class Shortcuts {
  #network: NetworkInterface;

  constructor(network: NetworkInterface) {
    this.#network = network;
  }

  async list(params?: ShortcutSearchParams) {
    return await this.#network.run(
      "shortcuts",
      {
        method: Method.Get,
        params
      }
    )
  }

  async get(shortcutId: string | number) {
    return await this.#network.run(
      `shortcuts/${shortcutId}`,
      {
        method: Method.Get
      }
    )
  }

  async create(body: ShortcutParams) {
    return await this.#network.run(
      "shortcuts",
      {
        method: Method.Post,
        body
      }
    )
  }

  async modify(shortcutId: string | number, body: ShortcutParams) {
    return await this.#network.run(
      `shortcuts/${shortcutId}`,
      {
        method: Method.Patch,
        body
      }
    )
  }
}

export default Shortcuts;