import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import axios from "axios";

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
    maxAge: 10 * 60, // 10 minutos
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }

      if (profile) {
        token.uuid = profile.sub;
        token.username = profile.preferred_username; 
      }

      try {
        const headers = {
          Authorization: `Bearer ${token.accessToken}`,
        };

        const response = await axios.get(
          `http://localhost:8081/api/v1/profiles?keycloakId=${token.uuid}`,
          { headers }
        );

        if (response.data && response.data.content && response.data.content.length > 0) {
          token.profile = response.data.content[0];
        } else {
          token.profile = null;
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        token.profile = null;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.uuid = token.uuid;
      session.user.username = token.username;
      session.accessToken = token.accessToken;
      session.user.profile = token.profile;

      return session;
    },
  },
};

export default NextAuth(authOptions);