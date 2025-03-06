// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      email?: string | null;
      name?: string | null;
      uuid?: string;
      profile?: {
        id: number;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        keycloakId: string;
        active: boolean;
        roles: { id: number; name: string }[];
        imageUrl: string | null;
      };
    };
  }
}
