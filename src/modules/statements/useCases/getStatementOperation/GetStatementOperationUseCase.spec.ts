import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationUseCase } from "../getStatementOperation/GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let usersRepositoryInMemory: IUsersRepository;
let statementsRepositoryInMemory: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get statement operation", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    })

    it("Should be able to get a statement operation", async () => {

        const user = await usersRepositoryInMemory.create({
            name: "Test user",
            email: "test@user.com",
            password: "test"
        });

        const statement = await statementsRepositoryInMemory.create({
            user_id: user.id ? user.id : "12345",
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "test",
        })

        const returnedStatement = await getStatementOperationUseCase.execute({ user_id: statement.user_id, statement_id: statement.id ? statement.id : "12345" });

        expect(returnedStatement).toBe(statement);
    })

    it("Should not be able to get a statement operation from a non existing user", () => {

        expect(async () => {

            const statement = await statementsRepositoryInMemory.create({
                user_id: "Non existing user_id",
                type: OperationType.DEPOSIT,
                amount: 100,
                description: "test",
            })
    
            await getStatementOperationUseCase.execute({ user_id: statement.user_id, statement_id: statement.id ? statement.id : "12345" });

        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    })

    it("Should not be able to get a statement operation that does not exist", () => {

        expect(async () => {

            const user = await usersRepositoryInMemory.create({
                name: "Test user",
                email: "test@user.com",
                password: "test"
            });

            await getStatementOperationUseCase.execute({ user_id: user.id ? user.id : "12345", statement_id: "Non existing statement" });

        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    })
})