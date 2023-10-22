import { AxiosInstance } from "axios";
import { MercadolibreAPIAuth } from "./auth";
import { IMercadolibreAPIConfig, createClient } from "./common";

export class MercadolibreAPI {
  public auth: MercadolibreAPIAuth;
  protected request: AxiosInstance;

  constructor(
    config?: IMercadolibreAPIConfig,
    options?: { client?: AxiosInstance },
  ) {
    try {
      this.request = options?.client ?? createClient();
      this.auth = new MercadolibreAPIAuth(config);
    } catch (e) {
      throw e;
    }
  }
}
