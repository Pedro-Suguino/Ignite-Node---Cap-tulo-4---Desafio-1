import { IUsersRepository } from "../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "../showUserProfile/ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let usersRepositoryInMemory: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
    
    beforeEach(() => {

        usersRepositoryInMemory = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    })

    it("Should be able to get a user", async () => {        

        const testUser = await usersRepositoryInMemory.create({
            name: "Test user",
            email: "test@user.com",
            password: "test",
        });

        const user = await showUserProfileUseCase.execute(testUser.id ? testUser.id : "12345");

        expect(user).toBe(testUser);
    })

    it("Should not be able to get a user that does not exist", async () => {        

        expect(async () => {
            
            await showUserProfileUseCase.execute("12345");
            
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    })
})