import { AxiosInstance } from "axios";
import { MercadolibreAPIAuth } from "./auth/auth";
import { IMercadolibreAPIConfig, createAxios } from "./base";

export class MercadolibreAPI {
  public auth: MercadolibreAPIAuth;
  protected request: AxiosInstance;

  constructor(config?: IMercadolibreAPIConfig) {
    try {
      this.request = createAxios();
      this.auth = new MercadolibreAPIAuth(config);
    } catch (e) {
      throw e;
    }
  }
}

export * from './auth/auth';
export * from './base';
export * from './countries';
export * from './errors';
export default MercadolibreAPI
