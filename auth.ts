//auth.ts  extend your authConfig object:

import NextAuth from 'next-auth'; // ! en next auth podemos utilizar muchos tipos de log in, como github o google por ejemplo. Next, you will need to add the providers option for NextAuth.js. providers is an array where you list different login options such as Google or GitHub. For this course, we will focus on using the Credentials provider only. estas simples credenciales son para logeanos con usuario y contrasena.

import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials'; //! The Credentials provider allows users to log in with a username and a password.
import { z } from 'zod';

import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions'; // este es el objeto con el tipo para TS
import bcrypt from 'bcrypt'; // call bcrypt.compare to check if the passwords match:

async function getUser(email: string): Promise<User | undefined> { // After validating the credentials, create a new getUser function that queries the user from the database.
    try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,

//! Adding the sign in functionality
//* You can use the authorize function to handle the authentication logic. Similarly to Server Actions, you can use zod to validate the email and password before checking if the user exists in the database:

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password); // bcrypt.compare to check if the passwords match:
          if (passwordsMatch) return user; // Finally, if the passwords match you want to return the user, otherwise, return null to prevent the user from logging in.  
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ], // por ej si usaramos log in con facebbok deberiamos declararlo aqui dentro como   providers: [Facebook].  providers is an array where you list different login options
});

//* Password hashing
// It's good practice to hash passwords before storing them in a database. 
// In your seed.js file, you used a package called bcrypt to hash the user's password before storing it in the database. You will use it again later in this chapter to compare that the password entered by the user matches the one in the database. 
//? However, you will need to create a separate file for the bcrypt package. This is because bcrypt relies on Node.js APIs not available in Next.js Middleware.