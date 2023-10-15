import { MercadolibreAPI } from "..";
import { MeliValidationError } from "../errors";

describe("MercadolibreAPI instantiation", () => {
  it("should throw error without initialization params", () => {
    try {
      new MercadolibreAPI();
    } catch (e: any) {
      expect(e).toBeInstanceOf(MeliValidationError);
      expect(e.name).toBe("MeliValidationError");
    }
  });

  it("MercadolibreAPI should create", () => {
    const meli = new MercadolibreAPI({
      clientId: "12345678910",
      clientSecret: "ultrasecret",
      redirectUri: "http://localhost:3000/callback",
    });
    expect(meli).toBeInstanceOf(MercadolibreAPI);
  });

  it("MercadolibreAPI gets envs default to required params", () => {
    // MERCADOLIBRE_APP_ID, MERCADOLIBRE_CLIENT_SECRET and MERCADOLIBRE_REDIRECT_URI
    process.env.MERCADOLIBRE_APP_ID = "12345678910";
    process.env.MERCADOLIBRE_CLIENT_SECRET = "ultrasecret";
    process.env.MERCADOLIBRE_REDIRECT_URI = "http://localhost:3000/callback";

    const meli = new MercadolibreAPI();
    expect(meli).toBeInstanceOf(MercadolibreAPI);

    delete process.env.MERCADOLIBRE_APP_ID;
    delete process.env.MERCADOLIBRE_CLIENT_SECRET;
    delete process.env.MERCADOLIBRE_REDIRECT_URI;
  });
});
