import dotenv from "dotenv";
dotenv.config();

export const config = {
  server: {
    environment: process.env.NODE_ENVIRONMENT,
    secretSession: process.env.SECRET_SESSION,
  },
  mongo: {
    url: process.env.MONGO_URL,
  },
  token: {
    privateKey: process.env.PRIVATE_KEY,
  },
  gmail: {
    account: process.env.GMAIL_ACCOUNT,
    password: process.env.GMAIL_PASSWORD,
    token: process.env.TOKEN_EMAIL,
  },
  github: {
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
};
