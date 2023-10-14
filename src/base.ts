import axios from "axios";

export function createAxios(domain: Domain) {
  return axios.create({
    baseURL: `https://api.mercadolibre.${domain}`,
  });
}

export interface Country {
  default_currency_id: string;
  id: string;
  name: string;
  domain_url: Domain;
}

export type Domain =
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

export type AuthenticationParams =
  | { redirectUri?: string; state?: string; pkce: false }
  | {
      redirectUri?: string;
      state?: string;
      pkce: true;
      codeChallenge: string;
      codeChallengeMethod: "S256" | "plain";
    };

export interface IMercadolibreAPIConfig {
  clientId: string;
  clientSecret: string;
  scope: string;
  domain: Domain;
  redirectUri?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token: string;
}

export interface IMercadolibreErrorResponse {
  error_description: string;
  error: string;
  status: number;
  cause: any[];
}

export enum GrantTypeEnum {
  CODE = "code",
  AUTHORIZATION_CODE = "authorization_code",
}

export interface IMercadolibreAPIAuth {
  getAuthenticationUrl(params: AuthenticationParams): Promise<string>;
}

export const DEFAULT_SCOPE = "offline_access read write";
