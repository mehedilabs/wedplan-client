import { betterAuth } from "better-auth";
import { getOAuthState } from "better-auth/api";
import { jwt } from "better-auth/plugins";
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

  plugins: [
    jwt({
      jwks: {
        jwksPath: "/jwks",
      },
    }),
  ],

  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor", "admin"],
        required: true,
        defaultValue: "customer",
        input: true,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      subscriptionPlan: {
        type: ["free", "premium"],
        required: true,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
      status: {
        type: ["active", "inactive", "blocked"],
        required: false,
        defaultValue: "active",
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          let selectedRole: "customer" | "vendor" = "customer";

          if (ctx?.path === "/callback/:id") {
            const oauthState = await getOAuthState<{
              role?: string;
            }>();

            selectedRole =
              oauthState?.role === "vendor" ? "vendor" : "customer";
          } else {
            // Enforce that public signup can ONLY be customer or vendor, never admin
            const requestedRole = (user as Record<string, unknown>)?.role;
            selectedRole = requestedRole === "vendor" ? "vendor" : "customer";
          }

          return {
            data: {
              role: selectedRole,
              subscriptionPlan: "free",
              subscriptionExpiresAt: null,
              status: "active",
            },
          };
        },
      },
      update: {
        before: async (data) => {
          // Prevent users from updating their own role, subscription, or status via profile endpoints
          const sanitized = { ...data } as Record<string, unknown>;
          delete sanitized.role;
          delete sanitized.subscriptionPlan;
          delete sanitized.subscriptionExpiresAt;
          delete sanitized.status;

          return {
            data: sanitized,
          };
        },
      },
    },
  },
});
