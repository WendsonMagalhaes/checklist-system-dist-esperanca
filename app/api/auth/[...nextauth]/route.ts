import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credenciais",
            credentials: {
                username: { label: "Usuário", type: "text" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials: any) {

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (!user) return null; // ou throw new Error("Usuário não encontrado");

                const passwordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!passwordValid) return null;

                return { id: user.id, name: user.name, username: user.username, role: user.role };
            }

        }),
    ],

    session: {
        strategy: "jwt" as const,
    },

    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }: any) {
            session.user = {
                ...session.user,
                id: token.id,
                username: token.username,
                role: token.role,
            };
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
