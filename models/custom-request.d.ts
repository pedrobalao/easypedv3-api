declare namespace Express {
  export interface Request {
    authID?: string;
    authToken?: string;
  }
}
