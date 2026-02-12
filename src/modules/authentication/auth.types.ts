export interface GoogleAuthDTO {
  idToken: string;
}

export interface GoogleUserPayload {
  googleId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
