import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/mongodb";
import { compare } from "bcryptjs";

declare module "next-auth" {
    interface User {
        balance?: number;
    }
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            balance?: number;
        };
    }
}

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db();
                const user = await db.collection("users").findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                const isValid = await compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Incorrect password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    balance: user.balance ?? 0,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.balance = user.balance;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.balance = typeof token.balance === "number" ? token.balance : 0;
            }
            return session;
        }
    }
});