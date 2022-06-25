import { NextFunction, Response, Request } from "express";
import admin from "firebase-admin";

async function checkAuthToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (
    token == null ||
    (!token.startsWith("Bearer ") && !token.startsWith("bearer "))
  ) {
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }

  let idToken = token.replace("Bearer ", "").replace("bearer ", "");

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.authID = decodedToken.ui;
    req.authToken = idToken;
  } catch (err) {
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }

  next();
}

export default checkAuthToken;
