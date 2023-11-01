import axios from "axios";

function createAxios() {
  return axios.create({
    baseURL: `https://api.mercadolibre.com`,
  });
}

interface Country {
  default_currency_id: string;
  id: string;
  name: string;
  domain_url: Domain;
}

type Domain =
  | "hn"
  | "cl"
  | "com.uy"
  | "com.do"
  | "com.bo"
  | "com.ar"
  | "com.cu"
  | "co.ve"
  | "com.gt"
  | "com.br"
  | "co.cr"
  | "com.co"
  | "com.pa"
  | "com.ec"
  | "com.pe"
  | "com.py"
  | "com.sv"
  | "com.mx"
  | "com.ni";

interface IMercadolibreAPIConfig {
  redirectUri?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  domain?: Domain;
  accessToken?: string;
  refreshToken?: string;
}

export {
  Country,
  Domain,
  IMercadolibreAPIConfig, createAxios
};
