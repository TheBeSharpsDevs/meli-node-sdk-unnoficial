export type AuthenticationParams =
  | { redirectUri?: string; state?: string; pkce?: false }
  | {
      redirectUri?: string;
      state?: string;
      pkce: true;
      codeChallenge: string;
      codeChallengeMethod: "S256" | "plain";
    };
