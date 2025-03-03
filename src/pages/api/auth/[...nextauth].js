import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 10 * 60,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }

      if (user) {
        token.uuid = profile.sub;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.uuid = token.uuid;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
