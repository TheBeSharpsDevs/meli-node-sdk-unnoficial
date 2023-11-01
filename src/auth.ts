import { AxiosError, AxiosInstance } from "axios";
import { URL } from "url";
import {
  Country,
  IMercadolibreAPIConfig,
  createAxios,
} from "./base";
import { countries } from "./countries";
import { MeliError, MeliValidationError } from "./errors";

type AuthenticationParams = { redirectUri?: string; state?: string; pkce?: false; } |
{
  redirectUri?: string;
  state?: string;
  pkce: true;
  codeChallenge: string;
  codeChallengeMethod: "S256" | "plain";
};
interface IAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token: string;
}
enum GrantTypeEnum {
  CODE = "code",
  AUTHORIZATION_CODE = "authorization_code",
  REFRESH_TOKEN = "refresh_token"
}
interface IMercadolibreAPIAuth {
  getAuthenticationUrl(params: AuthenticationParams): Promise<string>;
  getAccessToken(
    code: string,
    redirectUri?: string,
    codeVerifier?: string
  ): Promise<IAccessTokenResponse>;
  refreshAccessToken(refreshToken: string): Promise<IAccessTokenResponse>;
}
const DEFAULT_SCOPE = "offline_access read write";

const EXCHANGE_TOKEN_PATH = "/oauth/token";

class MercadolibreAPIAuth implements IMercadolibreAPIAuth {
  protected clientId: string;
  protected clientSecret: string;
  protected redirectUri: string;
  protected scope: string;
  protected accessToken?: string | null;
  protected refreshToken?: string | null;
  private country: Country | null;
  private client: AxiosInstance;

  constructor(
    config?: IMercadolibreAPIConfig,
    options?: { client?: AxiosInstance },
  ) {
    this.clientId =
      config?.clientId ?? (process.env.MERCADOLIBRE_APP_ID as string);
    this.clientSecret =
      config?.clientSecret ??
      (process.env.MERCADOLIBRE_CLIENT_SECRET as string);
    this.redirectUri =
      config?.redirectUri ?? (process.env.MERCADOLIBRE_REDIRECT_URI as string);
    this.scope = config?.scope ?? DEFAULT_SCOPE;
    this.accessToken = config?.accessToken ?? null;
    this.refreshToken = config?.refreshToken ?? null;
    this.country =
      countries.find((country) => country.domain_url == config?.domain) ?? null;
    this.client = options?.client ?? createAxios();

    if (!this.clientId || !this.clientSecret) {
      throw new MeliValidationError(
        "Params clientId, clientSecret are required within configuration or environment scope.",
      );
    }
  }

  async getAuthenticationUrl(params?: AuthenticationParams): Promise<string> {
    if (!params?.redirectUri && !this.redirectUri) {
      throw new Error(
        "redirectUri is required in configuration or environment",
      );
    }
    const authenticationUrl = new URL(
      `https://auth.mercadolibre.${
        this.country?.domain_url || "com.ar"
      }/authorization`,
    );
    authenticationUrl.searchParams.append("response_type", GrantTypeEnum.CODE);
    authenticationUrl.searchParams.append(
      "redirect_uri",
      params?.redirectUri ?? this.redirectUri,
    );
    authenticationUrl.searchParams.append("client_id", this.clientId);
    if (params?.pkce) {
      authenticationUrl.searchParams.append(
        "code_challenge",
        params.codeChallenge,
      );
      authenticationUrl.searchParams.append(
        "code_challenge_method",
        params.codeChallengeMethod,
      );
    }

    return authenticationUrl.toString();
  }

  async getAccessToken(
    code: string,
    redirectUri?: string,
    codeVerifier?: string,
  ): Promise<IAccessTokenResponse> {
    const axiosResponse = await this.client
      .post<IAccessTokenResponse>(EXCHANGE_TOKEN_PATH, null, {
        params: {
          grant_type: GrantTypeEnum.AUTHORIZATION_CODE,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: redirectUri ?? this.redirectUri,
          code_verifier: codeVerifier ?? undefined,
        },
      })
      .catch((error: Error | AxiosError) => {
        if (error instanceof AxiosError) {
          throw new MeliError(
            error.response?.data.error,
            error.stack,
            error.response?.status,
          );
        }
        throw error;
      });
    const token = axiosResponse.data;
    return token;
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<IAccessTokenResponse> {
    if (!refreshToken && !this.refreshToken) {
      throw new Error("refreshToken is required");
    }
    const axiosResponse = await this.client
      .post(EXCHANGE_TOKEN_PATH, null, {
        params: {
          grant_type: GrantTypeEnum.REFRESH_TOKEN,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken || this.refreshToken,
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .catch((error: Error | AxiosError) => {
        if (error instanceof AxiosError) {
          throw new MeliError(
            error.response?.data.error,
            error.stack,
            error.response?.status,
          );
        }
        throw error;
      });
    const token = axiosResponse.data;
    return token;
  }
}

export {
  AuthenticationParams, DEFAULT_SCOPE, EXCHANGE_TOKEN_PATH, GrantTypeEnum,
  IAccessTokenResponse, IMercadolibreAPIAuth, MercadolibreAPIAuth
};

