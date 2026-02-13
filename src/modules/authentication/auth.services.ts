import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import { GoogleUserPayload } from "./auth.types.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken: string): Promise<GoogleUserPayload> => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email || !payload.sub || !payload.email_verified) {
    throw new Error("Invalid Google token");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    firstName: payload.given_name,
    lastName: payload.family_name,
  };
};

export const findOrCreateGoogleUser = async (data: GoogleUserPayload) => {
  let user = await prisma.user.findUnique({
    where: { googleId: data.googleId },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: data.googleId,
          authProvider: "google",
        },
      });
    }
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        googleId: data.googleId,
        authProvider: "google",
      },
    });
  }

  return user;
};

export const generateJWT = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d", algorithm: "HS256" }
  );
};
