import {
  AuthServiceClient,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from "../gen/proto/auth";
import { credentials } from "@grpc/grpc-js";

const AUTH_URL = process.env.AUTH_URL || "localhost:5003";

const client = new AuthServiceClient(AUTH_URL, credentials.createInsecure());

interface IVerifyResponse {
  email: string;
  role: string;
}

export const verifyToken = (token: string) => {
  const req = { token } as VerifyTokenRequest;

  return new Promise<IVerifyResponse>((resolve, reject) => {
    client.verifyToken(req, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(res.role);
      resolve(res);
    });
  });
};
