import { createAxios } from "../base"

describe("axios instance creation", () => {
  it("should create", () => {
    const instance = createAxios('com.ar')
    expect(instance).toBeDefined()
  })
  
  it("should create with .com.ar default", () => {
    const instance = createAxios()
    expect(instance).toBeDefined()
    const url = instance.defaults.baseURL
    expect(/.com.ar/.test(url!)).toBeTruthy()
  })

  it("should create with custom domain", () => {
    const instance = createAxios('com.br')
    expect(instance).toBeDefined()
    const url = instance.defaults.baseURL
    expect(/.com.br/.test(url!)).toBeTruthy()
  });
})