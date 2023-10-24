import { createAxios } from "../base";

describe("axios instance creation", () => {
  it("should create", () => {
    const instance = createAxios();
    expect(instance).toBeDefined();
  });
});
