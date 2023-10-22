import { createClient } from "../common";

describe("axios instance creation", () => {
  it("should create", () => {
    const instance = createClient();
    expect(instance).toBeDefined();
  });
});
