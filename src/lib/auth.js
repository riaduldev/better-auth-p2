import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { Resend } from 'resend';

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("better-auth-db");
const resend = new Resend(process.env.RESEND_API_KEY);



export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

 emailVerification: {
  sendVerificationEmail: async ({ user, url }) => {
    console.log("Verification email callback triggered");
    console.log("Recipient:", user.email);

    try {
      const result = await resend.emails.send({
  from: "Acme <onboarding@resend.dev>",

//  for testing
  to: "riadulislam.bd.pabna@gmail.com",

  subject: "Verify your email address",
  html: `
    <h1>Please verify your email address</h1>
    <p>Click below to verify your email:</p>
    <a href="${url}">Verify Email</a>
  `,
});

console.log("Resend result:", result);

      if (result.error) {
        console.error("Resend API error:", result.error);
        return;
      }

      console.log("Resend accepted email:", result.data);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  },

  sendOnSignUp: true,
  autoSignInAfterVerification: true,
  expiresIn: 7 * 24 * 60 * 60,
},


  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
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