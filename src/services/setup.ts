import { Method, MeParams } from '../types';
import NetworkInterface from '../util/network';

class Setup {
  #network: NetworkInterface;

  constructor(network: NetworkInterface) {
    this.#network = network;
  }

  async setup(body: MeParams) {
    return await this.#network.run(
      "setup",
      {
        method: Method.Post,
        body
      }
    )
  }
}

export default Setup;