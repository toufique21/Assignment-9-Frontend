import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/database";
const client = new MongoClient(mongoUri);
export const db = client.db("mentorLagbe");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const canonicalAuthUrl =
    process.env.BETTER_AUTH_URL || "http://localhost:3000"

let canonicalHost = "localhost:3000"
try {
    canonicalHost = new URL(canonicalAuthUrl).host
} catch {
    canonicalHost = "localhost:3000"
}

export const auth = betterAuth({
    baseURL: {
        allowedHosts: [
            canonicalHost,
            "localhost:3000",
            "localhost:*",
            "*.vercel.app",
        ],
        protocol: canonicalAuthUrl.startsWith("https://") ? "https" : "http",
        fallback: canonicalAuthUrl,
    },
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
    },
    plugins: [jwt()],
    session: {
        cookieCache: {
            enabled: true,
            strategy: 'jwt',
            maxAge: 3 * 24 * 60 * 60
        }
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
