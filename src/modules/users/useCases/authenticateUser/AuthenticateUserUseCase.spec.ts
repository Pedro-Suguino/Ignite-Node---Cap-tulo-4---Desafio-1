import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

require("dotenv").config();

let usersRepositoryInMemory: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    })

    it("Should be able to authenticate a user", async () => {


        await createUserUseCase.execute({
            name: "Test user",
            email: "test@user.com",
            password: "test",
        });

        const result = await authenticateUserUseCase.execute({ email: "test@user.com", password: "test" });

        expect(result).toHaveProperty("token");
    })

    it("Should not be able to authenticate a user with incorrect email", async () => {
        expect(async () => {
            
            await createUserUseCase.execute({
                name: "Test user",
                email: "test@user.com",
                password: "test",
            });
            
            await authenticateUserUseCase.execute({ email: "incorrect@email", password: "test" });
            
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })

    it("Should not be able to authenticate a user with incorrect password", async () => {
        expect(async () => {
            
            await createUserUseCase.execute({
                name: "Test user",
                email: "test@user.com",
                password: "test",
            });
            
            await authenticateUserUseCase.execute({ email: "test@user.com", password: "incorrect password" });
            
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })
})