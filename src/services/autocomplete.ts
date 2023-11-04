import { Method } from '../types';
import NetworkInterface from '../util/network';

class AutoComplete {
  #network: NetworkInterface;

  constructor(network: NetworkInterface) {
    this.#network = network;
  }

  async users(search: string) {
    return await this.#network.run(
      "autocomplete/users",
      {
        method: Method.Get,
        params: { search }
      }
    )
  }
}

export default AutoComplete;