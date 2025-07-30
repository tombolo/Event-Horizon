import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            name?: string;
            email?: string;
            image?: string;
            id: string; // ✅ extend user type with `id`
        };
    }

    interface User {
        id: string;
        name?: string;
        email?: string;
        image?: string;
    }
}
