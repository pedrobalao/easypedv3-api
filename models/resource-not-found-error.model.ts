export class HttpRespException extends Error {
  httpCode: number;
  constructor(msg: string, httpCode: number) {
    super(msg);
    this.httpCode = httpCode;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpRespException.prototype);
  }
}
