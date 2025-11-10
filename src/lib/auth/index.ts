import { DefaultSession, DefaultUser, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserService from "@/services/users-service";

export interface Role {
  name: string;
  description: string;
  granted_at: string; //date
}

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name: string;
    address: string;
    email: string;
    infoCid?: string;
    avatar?: string;
    roles: string[];
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      address: string;
      email: string;
      infoCid?: string;
      avatar?: string;
      roles?: string[];
    } & DefaultSession["user"];
  }
}


export const authOptions = {
  providers: [

    //TODO: we can support login with credentials/social
    CredentialsProvider({
      id: "message-signature",
      name: "MessageSignature",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials: Record<"message" | "signature", string> | undefined) {
        if (!credentials || !credentials.signature || !credentials.message) return null;

        try {
          const user = await new UserService().loginWithSignature(credentials.message, credentials.signature);
          if (user) return user;

        } catch (err: any) {
          throw new Error(err?.code || "Unknown");
        }

        return null;
      }
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, trigger }: { token: any; user?: any, trigger?: any }) {

      if (trigger == "update") {
        const updated = await new UserService().getUser(token.id);
        user = updated;
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.address = user.address;
        token.email = user.email;
        token.website = user.website;
        token.avatar = user.avatar;
        token.roles = user.roles;
      } 

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {

      if (token?.id && session?.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.address = token.address;
        session.user.email = token.email;
        session.user.roles = token.roles;
        session.user.avatar = token.avatar;
        session.user.website = token.website;


      }

      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
