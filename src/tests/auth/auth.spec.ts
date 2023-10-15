import MockAdapter from 'axios-mock-adapter';
import { MercadolibreAPI } from "../..";
import { MercadolibreAPIAuth } from "../../auth/auth";
import { IMercadolibreAPIConfig, createAxios } from "../../base";
import { MeliValidationError } from "../../errors";

describe("MercadolibreAPIAuth", () => {
  it("should be available without MercadolibreAPI instance", () => {
    const meli = new MercadolibreAPIAuth({
      clientId: "12345678910",
      clientSecret: "ultrasecret",
      redirectUri: "http://localhost:3000/callback",
    });
    expect(meli).toBeInstanceOf(MercadolibreAPIAuth);
  });

  it("should throw MeliValidationError without required config params", () => {
    try {
      new MercadolibreAPIAuth();
    } catch (e: any) {
      expect(e).toBeInstanceOf(MeliValidationError);
      expect(e.name).toBe("MeliValidationError");
    }
  });

  it("gets envs default to required params", () => {
    // MERCADOLIBRE_APP_ID, MERCADOLIBRE_CLIENT_SECRET and MERCADOLIBRE_REDIRECT_URI
    process.env.MERCADOLIBRE_APP_ID = "12345678910";
    process.env.MERCADOLIBRE_CLIENT_SECRET = "ultrasecret";
    process.env.MERCADOLIBRE_REDIRECT_URI = "http://localhost:3000/callback";

    const meliAuth = new MercadolibreAPIAuth();
    expect(meliAuth).toBeInstanceOf(MercadolibreAPIAuth);

    delete process.env.MERCADOLIBRE_APP_ID;
    delete process.env.MERCADOLIBRE_CLIENT_SECRET;
    delete process.env.MERCADOLIBRE_REDIRECT_URI;
  });

  describe("getAuthenticationUrl", () => {
    it("should generate a valid authentication uri", async () => {
      const config: IMercadolibreAPIConfig = {
        clientId: "your-client-id",
        clientSecret: "your-client-secret",
        redirectUri: "your-redirect-uri.com",
        scope: "your-scope",
        domain: "com.bo",
      };
      const mercadolibreAuth = new MercadolibreAPIAuth(config);
      const authenticationUrl = await mercadolibreAuth.getAuthenticationUrl();
      expect(authenticationUrl).toContain("https://auth.mercadolibre.com.bo");
      expect(authenticationUrl).toContain("response_type=code");
      expect(authenticationUrl).toContain("your-redirect-uri.com");
      expect(authenticationUrl).toContain("client_id=your-client-id");
    });

    it("should throws an error if redirectUri is missing", async () => {
      const mercadolibreAuth = new MercadolibreAPIAuth({
        clientId: "your-client-id",
        clientSecret: "your-client-secret",
      });
      await expect(mercadolibreAuth.getAuthenticationUrl()).rejects.toThrow(
        "redirectUri is required",
      );
    });

    it("should NOT throws an error if redirectUri is setted on getAuthenticationUrl", async () => {
      const mercadolibreAuth = new MercadolibreAPIAuth({
        clientId: "your-client-id",
        clientSecret: "your-client-secret",
      });
      await expect(
        mercadolibreAuth.getAuthenticationUrl({
          redirectUri: "your-redurec-uri.com",
        }),
      ).resolves.toContain("your-redurec-uri.com");
    });

    it("should take redirectUri from MercadolibreAPI constructor", async () => {
      const meli = new MercadolibreAPI({
        clientId: "3698383169153869",
        clientSecret: "V2o1Z8VGBjlhc1xzCZmgkcVCa37yzrdp",
        redirectUri: "http://localhost:3000/callback",
      });
      expect(meli).toBeInstanceOf(MercadolibreAPI);
      const authenticationUrl = await meli.auth.getAuthenticationUrl();
      expect(authenticationUrl).toContain("https://auth.mercadolibre.com.ar");
      expect(authenticationUrl).toContain("response_type=code");
      expect(authenticationUrl).toContain("localhost");
      expect(authenticationUrl).toContain("client_id=3698383169153869");
    });
  });

  describe("getAccessToken", () => {
  let auth: MercadolibreAPIAuth;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    const client = createAxios()
    mockAxios = new MockAdapter(client);
    auth = new MercadolibreAPIAuth({
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      redirectUri: 'your-redirect-uri',
    }, { client });
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should get access token successfully', async () => {
    // Define the mock response from the external API
    const mockAccessTokenResponse = {
      access_token: "APP_USR-123456-090515-8cc4448aac10d5105474e1351-1234567",
      token_type: "bearer",
      expires_in: 10800,
      scope: "offline_access read write",
      user_id: 1234567,
      refresh_token: "TG-5b9032b4e23464aed1f959f-1234567"
    };

    // Mock the Axios request to the external API
    mockAxios.onPost('/oauth/token').reply(200, mockAccessTokenResponse);

    // Call the getAccessToken function
    const code = 'your-auth-code';
    const response = await auth.getAccessToken(code);

    // Assertions
    expect(response.access_token).toEqual(mockAccessTokenResponse.access_token);
    expect(response.token_type).toEqual(mockAccessTokenResponse.token_type);
    expect(response.expires_in).toEqual(mockAccessTokenResponse.expires_in);
    expect(response.refresh_token).toEqual(mockAccessTokenResponse.refresh_token);
    expect(response.user_id).toEqual(mockAccessTokenResponse.user_id);
    expect(response.scope).toEqual(mockAccessTokenResponse.scope);
  });

  it('should handle errors when getting access token', async () => {
    // Mock an error response from the external API
    mockAxios.onPost('/oauth/token').reply(400, { error: 'invalid_grant' });

    // Call the getAccessToken function
    const code = 'your-auth-code';

    try {
      await auth.getAccessToken(code);
    } catch (error: any) {
      // Assert that the function correctly throws an error
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toEqual('MeliError');
      expect(error.status).toEqual(400);
      expect(error.reason).toEqual('invalid_grant');
    }
  });
  })
});
