import { Method, MeParams } from '../types';
import NetworkInterface from '../util/network';

class Me {
  #network: NetworkInterface;

  constructor(network: NetworkInterface) {
    this.#network = network;
  }

  async get() {
    return await this.#network.run(
      "me",
      {
        method: Method.Get
      }
    )
  }

  async beginMfaSetup() {
    return await this.#network.run(
      "me/mfa/setup",
      {
        method: Method.Post
      }
    )
  }

  async completeMfaSetup(otp: string) {
    return await this.#network.run(
      "me/mfa/complete",
      {
        method: Method.Post,
        body: {
          otp
        }
      }
    )
  }

  async disableMfa() {
    return await this.#network.run(
      "me/mfa",
      {
        method: Method.Delete
      }
    )
  }

  async modify(body: MeParams) {
    return await this.#network.run(
      "me",
      {
        method: Method.Patch,
        body
      }
    )
  }
}

export default Me;