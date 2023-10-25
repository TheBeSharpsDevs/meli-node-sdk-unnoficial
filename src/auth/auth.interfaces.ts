export type AuthenticationParams = { redirectUri?: string; state?: string; pkce?: false; } |
{
  redirectUri?: string;
  state?: string;
  pkce: true;
  codeChallenge: string;
  codeChallengeMethod: "S256" | "plain";
};export interface IAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token: string;
}
export enum GrantTypeEnum {
  CODE = "code",
  AUTHORIZATION_CODE = "authorization_code",
  REFRESH_TOKEN = "refresh_token"
}
export interface IMercadolibreAPIAuth {
  getAuthenticationUrl(params: AuthenticationParams): Promise<string>;
  getAccessToken(
    code: string,
    redirectUri?: string,
    codeVerifier?: string
  ): Promise<IAccessTokenResponse>;
  refreshAccessToken(refreshToken: string): Promise<IAccessTokenResponse>;
}
export const DEFAULT_SCOPE = "offline_access read write";

