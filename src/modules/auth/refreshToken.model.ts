import mongoose, { Schema } from "mongoose";

export interface IRefresToken {
    userId: mongoose.Types.ObjectId;
    tokenHash: string;
    family: string;
    expiresAt: Date;
    isRevoked: boolean;
    createdAt: Date;
}

const refreshTokenSchema = new mongoose.Schema<IRefresToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            required: true,
        },
        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        isRevoked: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    },
);

refreshTokenSchema.index({expiresAt: 1}, {expireAfterSeconds : 0});

export const RefreshToken = mongoose.model<IRefresToken>("RefreshToken", refreshTokenSchema)
