// next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    accessToken?: string;
    user?: {
      email?: string | null;
      name?: string | null;
      uuid?: string;
    };
  }
}
