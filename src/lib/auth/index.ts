import { DefaultSession, DefaultUser, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserService from "@/services/users-service";
import { Role } from "@/roles";
import { AuthService } from "@/services/auth-service";



type AuthUser = {
  id: string;
  address: string;
  infoCid?: string;
  avatar?: string;
  roles: Role[];
};

declare module "next-auth" {
  interface User extends DefaultUser, AuthUser {}
  
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & AuthUser;
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
          const user = await new AuthService().loginWithSignature(credentials.message, credentials.signature);
          if (user) return user;

        } catch (err: any) {
          if(err.message == "USER_NOT_FOUND"){
           throw err;
          } else { //Use this to hide details of other errors that can happen during login (like db connection issues, etc) 
            throw new Error(err?.code || "Unknown");
          }
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
