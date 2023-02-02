import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: IUsersRepository;
let statementsRepositoryInMemory: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}  

describe("Create Statement", () => {
    
    beforeEach(() => {

        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    })

    it("Should be able to create a statement", async () => {
        
        const testUser = await usersRepositoryInMemory.create({
            name: "test user",
            email: "test@user.com",
            password: "testPassword",
        })

        const statement = await createStatementUseCase.execute({
            user_id:  testUser.id ? testUser.id : "12345",
            type: OperationType.DEPOSIT,
            description: "test description",
            amount: 123,
        })

        expect(statement).toHaveProperty("id");
    })

    it("Should not be able to create a statement with a non existing user", () => {

        expect(async () => {

            await createStatementUseCase.execute({
                user_id: "Test user id",
                type: OperationType.DEPOSIT,
                description: "test description",
                amount: 123,
            })

        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    })

    it("Should not be able to create a withdraw statement of there are not sufficient funds", () => {

        expect(async () => {

            const testUser = await usersRepositoryInMemory.create({
                name: "test user",
                email: "test@user.com",
                password: "testPassword",
            })
            
            await createStatementUseCase.execute({
                user_id:  testUser.id ? testUser.id : "12345",
                type: OperationType.WITHDRAW,
                description: "test description",
                amount: 123,
            })
            
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    })
})