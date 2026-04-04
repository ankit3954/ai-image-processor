export const jwtConfig = {
    access: {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: "15m" 
    },
    refresh: {
        expiresIn: 30 * 24 * 60 * 60 * 1000,
    },
    issuer: process.env.JWT_ISSUER || "imagegen-api",
    audience: process.env.JWT_AUDIENCE || "imagegen-client",
}