import { Method, ShortcutSearchParams, VersionParams, VersionPatchParams } from '../types';
import NetworkInterface from '../util/network';

class Versions {
  #network: NetworkInterface;

  constructor(network: NetworkInterface) {
    this.#network = network;
  }

  async list(shortcutId: string | number, params?: ShortcutSearchParams) {
    return await this.#network.run(
      `shortcuts/${shortcutId}/history`,
      {
        method: Method.Get,
        params
      }
    )
  }

  async get(shortcutId: string | number, versionNumber: string) {
    return await this.#network.run(
      `shortcuts/${shortcutId}/version/${versionNumber}`,
      {
        method: Method.Get
      }
    )
  }

  async getLatest(shortcutId: string | number) {
    return this.get(shortcutId, "latest")
  }

  async create(shortcutId: string | number, body: VersionParams) {
    return await this.#network.run(
      `shortcuts/${shortcutId}/version`,
      {
        method: Method.Post,
        body
      }
    )
  }

  async modify(shortcutId: string | number, versionNumber: string, body: VersionPatchParams) {
    return await this.#network.run(
      `shortcuts/${shortcutId}/version/${versionNumber}`,
      {
        method: Method.Patch,
        body
      }
    )
  }
}

export default Versions;