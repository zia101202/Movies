// lib/auth.ts
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import {connectToDatabase} from "./mongodb";
import User from "@/models/user";


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }


        await connectToDatabase();
       const existingUser= await User.findOne({ email: credentials.email });
        console.log(existingUser);
       if (!existingUser) {
          throw new Error("No user found");
        }
        
        const isValid = await bcrypt.compare(credentials.password, existingUser.hashedPassword);
        console.log(isValid);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { id: existingUser.id, email: existingUser.email };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
