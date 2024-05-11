import { Method, VersionParams, VersionPatchParams, VersionSearchParams } from '../types';
import NetworkInterface from '../util/network';

class Versions {
  #network: NetworkInterface;

  constructor(network: NetworkInterface) {
    this.#network = network;
  }

  async list(shortcutId: string | number, params?: VersionSearchParams) {
    return await this.#network.run(
      `shortcuts/${shortcutId}/history`,
      {
        method: Method.Get,
        params
      }
    )
  }

  async get(shortcutId: string | number, versionNumber: string, params?: VersionSearchParams) {
    return await this.#network.run(
      `shortcuts/${shortcutId}/version/${versionNumber}`,
      {
        method: Method.Get,
        params
      }
    )
  }

  async getLatest(shortcutId: string | number, params?: VersionSearchParams) {
    return this.get(shortcutId, "latest", params)
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