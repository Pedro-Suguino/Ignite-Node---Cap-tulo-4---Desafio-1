import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let usersRepositoryInMemory: IUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Create user", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    })

    it("Should be able to create a user", async () => {

        const user = await createUserUseCase.execute({
            name: "Test user",
            email: "test@user.com",
            password: "test"
        });

        expect(user).toHaveProperty("id");
    })

    it("Should not be able to create a user with an already registered email", () => {

        expect(async () => {

            const user1 = await createUserUseCase.execute({
                name: "Test user 1",
                email: "test@user.com",
                password: "test1"
            });

            const user2 = await createUserUseCase.execute({
                name: "Test user 2",
                email: "test@user.com",
                password: "test2"
            });
            
        }).rejects.toBeInstanceOf(CreateUserError);
    })
})