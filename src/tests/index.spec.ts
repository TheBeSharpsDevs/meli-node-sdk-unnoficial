import { dummy } from "../index";

describe("dummy", () => {
  it("works", () => {
    expect(dummy("John")).toBe("Hello John");
  });
});
