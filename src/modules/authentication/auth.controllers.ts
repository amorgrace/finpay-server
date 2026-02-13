import { Request, Response } from "express";
import { googleAuthSchema } from "./auth.schema.js";
import { verifyGoogleToken, findOrCreateGoogleUser, generateJWT } from "./auth.services.js";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    /*  
      #swagger.tags = ['Auth']
      #swagger.description = 'Log in a user using Google OAuth'
      #swagger.parameters['idToken'] = {
        in: 'body',
        description: 'Google OAuth ID Token',
        required: true,
        type: 'string',
        schema: {
          idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3..."
        }
      }
    */
    const { success, data, error } = googleAuthSchema.safeParse(req.body);

    if (!success) return res.status(400).json({ message: "Invalid idToken", details: error });

    const googleData = await verifyGoogleToken(data.idToken);
    const user = await findOrCreateGoogleUser(googleData);
    const token = generateJWT(user.id);

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Authentication failed" });
  }
};
