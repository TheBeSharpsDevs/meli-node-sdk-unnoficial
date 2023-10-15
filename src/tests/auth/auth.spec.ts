import { MercadolibreAPIAuth } from "../../auth/auth";
import { AuthenticationParams, IMercadolibreAPIConfig } from "../../base";
import { MeliValidationError } from "../../errors";

describe("MercadolibreAPIAuth", () => {
  it("should be available without MercadolibreAPI instance", () => {
    const meli = new MercadolibreAPIAuth({
      config: {
        clientId: "12345678910",
        clientSecret: "ultrasecret",
        redirectUri: "http://localhost:3000/callback",
      },
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
    const config: IMercadolibreAPIConfig = {
      clientId: "your-client-id",
      clientSecret: "your-client-secret",
      redirectUri: "your-redirect-uri",
      scope: "your-scope",
      domain: "com.bo",
    };

    const mercadolibreAuth = new MercadolibreAPIAuth({ config });

    it("should generate a valid authentication uri", async () => {
      const params: AuthenticationParams = {
        redirectUri: "https://your-redirect-uri.com",
      };

      const authenticationUrl =
        await mercadolibreAuth.getAuthenticationUrl(params);
      expect(authenticationUrl).toContain("https://auth.mercadolibre.com.bo");
      expect(authenticationUrl).toContain("response_type=code");
      expect(authenticationUrl).toContain("your-redirect-uri.com");
      expect(authenticationUrl).toContain("client_id=your-client-id");
    });

    it("should throws an error if redirectUri is missing", async () => {
      const params = {};
      await expect(
        mercadolibreAuth.getAuthenticationUrl(params),
      ).rejects.toThrow("redirectUri is required");
    });
  });
});
