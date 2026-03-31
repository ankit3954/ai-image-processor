import { generateAccessToken, generateRefreshToken } from "../../token/token.service.js";
import { User, type IUser } from "../user/user.model.js"
import bcyrpt from "bcrypt"
import { RefreshToken } from "./refreshToken.model.js";

export const register = async (
    data: {
        email: string,
        username: string,
        password: string
    }
):Promise<Omit<IUser, "password">>=> {
    const existingEmail = await User.findOne({email: data.email});
    if(existingEmail){
        throw { status: 409, message: "An account with this email already exists"};
    }

    const existingUsername = await User.findOne({username: data.username});
    if(existingUsername){
        throw { status: 409, message: "An account with this username already exists"};
    }

    const hashedPassword = await bcyrpt.hash(data.password, 12);

    const user = await User.create({
        email: data.email,
        username: data.username,
        password: hashedPassword
    })

    return user.toJSON() as Omit<IUser, "password">;
}

export const login = async (
     data: {
        email: string,
        password: string
    }
):Promise<{user: Omit<IUser, "password">; tokens: { accessToken: string, refreshToken: string}}> => {

    const user = await User.findOne({email: data.email}).select("+password");

    if(!user){
         throw { status: 401, message: "Invalid Credentials"};
    }

    if(!user.isActive){
        throw {status: 403, message: "User is not accessible"};
    }

    const isPasswordCorrect = await bcyrpt.compare(data.password, user.password);
    if(!isPasswordCorrect){
        throw { status: 409, message: "Invalid Credentials"};
    }

    const accessToken = generateAccessToken({
        userId: user._id.toString(),
        role: user.role
    });

    const {raw, hashed, expiresAt} = generateRefreshToken();

    await RefreshToken.create({
        userId: user._id,
        tokenHash: hashed,
        expiresAt,
    })
    
    return {
        user: user.toJSON() as Omit<IUser, "password">,
        tokens: {
            accessToken,
            refreshToken: raw
        }
    }
}