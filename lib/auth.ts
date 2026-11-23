import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/database";
const client = new MongoClient(mongoUri);
export const db = client.db("mentorLagbe");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
    },
    socialProviders:
        googleClientId && googleClientSecret
            ? {
                  google: {
                      clientId: googleClientId,
                      clientSecret: googleClientSecret,
                  },
              }
            : {},
    user: {
        additionalFields: {
            role: { type: "string", defaultValue: "student", required: false },
            plan: { type: "string", defaultValue: "free", required: false },
            phone: { type: "string", required: false },
            bio: { type: "string", required: false },
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});
