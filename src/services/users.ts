import { Method, UserParams, UserSearchParams } from '../types';
import NetworkInterface from '../util/network';

class Users {
  #network: NetworkInterface;

  constructor(network: NetworkInterface) {
    this.#network = network;
  }

  async list(params?: UserSearchParams) {
    return await this.#network.run(
      "users",
      {
        method: Method.Get,
        params
      }
    )
  }

  async get(userId: string | number) {
    return await this.#network.run(
      `users/${userId}`,
      {
        method: Method.Get
      }
    )
  }

  async create(body: UserParams) {
    return await this.#network.run(
      "users",
      {
        method: Method.Post,
        body
      }
    )
  }

  async modify(userId: string | number, body: UserParams) {
    return await this.#network.run(
      `users/${userId}`,
      {
        method: Method.Patch,
        body
      }
    )
  }
}

export default Users;