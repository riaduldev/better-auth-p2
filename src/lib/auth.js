import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("better-auth-db");

export const auth = betterAuth({
  baseURL: "http://localhost:3000",

  // trustedOrigins: [
  //   "http://localhost:3000",
  //   "http://localhost:3001",
  // ],

  emailAndPassword: {
    enabled: true,
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