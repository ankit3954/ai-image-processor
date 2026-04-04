export interface AccessTokenPayload {
  userId: string;
  role: "user" | "admin";
}
