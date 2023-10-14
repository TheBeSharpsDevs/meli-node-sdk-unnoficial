import { AxiosInstance } from "axios";
import { MercadolibreAPIAuth } from "./auth/auth";
import { IMercadolibreAPIConfig, createAxios } from "./base";

export class MercadolibreAPI {
  public auth: MercadolibreAPIAuth;
  protected request: AxiosInstance;

  constructor(config?: IMercadolibreAPIConfig) {
    this.request = createAxios(config?.domain || "com.ar");
    this.auth = new MercadolibreAPIAuth({ config, request: this.request });
  }
}
