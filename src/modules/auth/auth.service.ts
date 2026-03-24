import { User, type IUser } from "../user/user.model.js"
import bcyrpt from "bcrypt"

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

export const login = async () => {
    
}