import mongoose, { Schema } from "mongoose";

export interface IUser {
    email: string;
    password?: string;
    username: string;
    role: "user" | "admin";
    plan: "free" | "starter" | "pro" | "enterprise";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    plan: {
        type: String,
        enum: ["free", "starter", "pro", "enterprise"],
        default: "free",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
    }
);

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokenVersion;
    return user;
}

export const User = mongoose.model<IUser>("User", UserSchema);