
import { betterAuth } from "better-auth";
import { getOAuthState } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI!);

const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor"],
        required: true,
        defaultValue: "customer",
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          if (ctx?.path === "/callback/:id") {
            const oauthState = await getOAuthState<{
              role?: string;
            }>();

            const selectedRole =
              oauthState?.role === "vendor" ? "vendor" : "customer";

            return {
              data: {
                role: selectedRole,
              },
            };
          }
        },
      },
    },
  },
});
