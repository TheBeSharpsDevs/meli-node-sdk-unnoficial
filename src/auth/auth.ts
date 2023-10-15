import { AxiosError, AxiosInstance } from "axios";
import { URL } from "url";
import {
  AuthenticationParams,
  Country,
  DEFAULT_SCOPE,
  GrantTypeEnum,
  IAccessTokenResponse,
  IMercadolibreAPIAuth,
  IMercadolibreAPIConfig,
  createAxios,
} from "../base";
import { countries } from "../countries";
import { MeliValidationError } from "../errors";

const EXCHANGE_TOKEN_PATH = "/oauth/token";

export class MercadolibreAPIAuth implements IMercadolibreAPIAuth {
  protected clientId: string;
  protected clientSecret: string;
  protected redirectUri: string;
  protected scope: string;
  protected accessToken?: string | null;
  protected refreshToken?: string | null;
  private country: Country | null;
  private request: AxiosInstance;

  constructor(params: {
    request?: AxiosInstance;
    config?: IMercadolibreAPIConfig;
  }) {
    const { config, request } = params;
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
    this.request = request ?? createAxios(config?.domain ?? "com.ar");

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new MeliValidationError(
        "Params clientId, clientSecret and redirectUri are required within configuration or environment scope.",
      );
    }
  }

  async getAuthenticationUrl(params: AuthenticationParams): Promise<string> {
    if (!params?.redirectUri || !this.redirectUri) {
      throw new Error("redirectUri is required");
    }
    const authenticationUrl = new URL(
      `https://auth.mercadolibre${
        this.country?.domain_url || "com.ar"
      }/authorization`,
    );
    authenticationUrl.searchParams.append("response_type", GrantTypeEnum.CODE);
    authenticationUrl.searchParams.append(
      "redirect_uri",
      params?.redirectUri ?? this.redirectUri,
    );
    authenticationUrl.searchParams.append("client_id", this.clientId);
    if (params.pkce) {
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
    codeVerifier?: string,
  ): Promise<IAccessTokenResponse> {
    const axiosResponse = await this.request
      .post<IAccessTokenResponse>(EXCHANGE_TOKEN_PATH, null, {
        params: {
          grant_type: GrantTypeEnum.AUTHORIZATION_CODE,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: this.redirectUri,
          code_verifier: codeVerifier ?? undefined,
        },
      })
      .catch((error: Error | AxiosError) => {
        if (error instanceof AxiosError) {
          error.response?.data;
        }
        throw error;
      });
    const token = axiosResponse.data;
    return token;
  }
}
