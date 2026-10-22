import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { Resend } from 'resend';

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("better-auth-db");
const resend = new Resend(process.env.RESEND_API_KEY);


export const auth = betterAuth({
  baseURL: "http://localhost:3000",

  // trustedOrigins: [
  //   "http://localhost:3000",
  //   "http://localhost:3001",
  // ],

  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
  sendVerificationEmail: async({user, url}) => {
    void resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
        to: user.email,
        subject: 'Reset your password',
        html: `
        <h1>Please verify your email address</h1>
        Click <a href="${url}">click here</a> to reset your password.
        `,
    })

  },
  sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 7*24*3600 // 7 days
  },
  
  socialProviders: {
        google: { // [!code highlight]
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET
        }, 
        github: { 
            clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID, 
            clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET, 
        },
    },

  database: mongodbAdapter(db, {
    client,
  }),
});