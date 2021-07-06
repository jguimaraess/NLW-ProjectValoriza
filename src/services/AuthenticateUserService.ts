import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getCustomRepository } from "typeorm";

import { UsersRepositories } from "../repositories/UsersRepositories";

interface IAuthenticateRequest {
    email: string;
    password: string;
}
class AuthenticateUserService {
    async execute({ email, password }: IAuthenticateRequest){
        const usersRepositories = getCustomRepository(UsersRepositories);

        const user = await usersRepositories.findOne({
            email,
        });

        if(!user){
            throw new Error("Email/Password incorrect");
        }

        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch){
            throw new Error("Email/Password incorrect");
        }

        // Gerar token

        const token = sign(
            {
                email: user.email,
            },"f64798e44d4fae58a878942a533c46d1",{
                subject : user.id,
                expiresIn: "1d"
            }
        );
        return token;
    }
}

export { AuthenticateUserService }