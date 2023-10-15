import { MercadolibreAPI } from "../..";
import { MercadolibreAPIAuth } from "../../auth/auth";
import { IMercadolibreAPIConfig } from "../../base";
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
    it("should generate a valid authentication uri", async () => {
      const config: IMercadolibreAPIConfig = {
        clientId: "your-client-id",
        clientSecret: "your-client-secret",
        redirectUri: "your-redirect-uri.com",
        scope: "your-scope",
        domain: "com.bo",
      };
      const mercadolibreAuth = new MercadolibreAPIAuth({ config });
      const authenticationUrl = await mercadolibreAuth.getAuthenticationUrl();
      expect(authenticationUrl).toContain("https://auth.mercadolibre.com.bo");
      expect(authenticationUrl).toContain("response_type=code");
      expect(authenticationUrl).toContain("your-redirect-uri.com");
      expect(authenticationUrl).toContain("client_id=your-client-id");
    });

    it("should throws an error if redirectUri is missing", async () => {
      const mercadolibreAuth = new MercadolibreAPIAuth({
        config: {
          clientId: "your-client-id",
          clientSecret: "your-client-secret",
        },
      });
      await expect(mercadolibreAuth.getAuthenticationUrl()).rejects.toThrow(
        "redirectUri is required",
      );
    });

    it("should NOT throws an error if redirectUri is setted on getAuthenticationUrl", async () => {
      const mercadolibreAuth = new MercadolibreAPIAuth({
        config: {
          clientId: "your-client-id",
          clientSecret: "your-client-secret",
        },
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
});
