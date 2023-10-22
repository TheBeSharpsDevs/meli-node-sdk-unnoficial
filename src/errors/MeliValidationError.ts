import MeliError from "./MeliError";

export default class MeliValidationError extends MeliError {
  constructor(reason: string, rawError?: string) {
    super(reason, rawError);
    this.name = "MeliValidationError";
  }
}
