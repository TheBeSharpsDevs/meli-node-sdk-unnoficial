export default class MeliError extends Error {
  public raw: string | null;
  public status: number | null;
  public reason: string;
  constructor(reason: string, rawError?: string, status?: number) {
    super(reason);
    this.reason = reason;
    this.name = "MeliError";
    this.raw = rawError ?? null;
    this.status = status ?? null;
  }
}
