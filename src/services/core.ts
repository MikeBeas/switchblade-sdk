import { Method, LoginParams } from '../types';
import NetworkInterface from '../util/network';

class Core {
  #network: NetworkInterface;

  constructor(network: NetworkInterface) {
    this.#network = network;
  }

  async getServerConfig() {
    return await this.#network.run(
      "",
      {
        method: Method.Get
      }
    )
  }

  async login(params: LoginParams) {
    const { username, password, otp, mfaToken } = params;
    const body = {
      username,
      password,
      otp
    }

    return await this.#network.run(
      "login",
      {
        token: mfaToken,
        method: Method.Post,
        body
      }
    )
  }

  async verifySession() {
    return await this.#network.run(
      "verify",
      {
        method: Method.Get
      }
    )
  }
}

export default Core;