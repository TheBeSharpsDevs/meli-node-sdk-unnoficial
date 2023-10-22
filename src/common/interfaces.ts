import { AuthenticationParams } from "./types";

export interface Country {
  default_currency_id: string;
  id: string;
  name: string;
  domain_url:
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
}

export interface IMercadolibreAPIConfig {
  redirectUri?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  domain?:
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

export interface IMercadolibreAPIAuth {
  getAuthenticationUrl(params: AuthenticationParams): Promise<string>;
  getAccessToken(
    code: string,
    redirectUri?: string,
    codeVerifier?: string,
  ): Promise<IAccessTokenResponse>;
  refreshAccessToken(refreshToken: string): Promise<IAccessTokenResponse>;
}
