import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: IUsersRepository;
let statementsRepositoryInMemory: IStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Get balance", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    })

    it("Should bea able to get the balance of a user", async () => {

        const user = await usersRepositoryInMemory.create({
            name: "Test user",
            email: "test@user.com",
            password: "test"
        });

        await statementsRepositoryInMemory.create({
            user_id: user.id ? user.id : "12345",
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "test",
        })

        const balance = await getBalanceUseCase.execute({ user_id: user.id ? user.id : "12345" });

        expect(balance.balance).toBe(100);
    })

    it("Should not be able to get the balance of a non exissiting user", () => {

        expect(async () => {

            await getBalanceUseCase.execute({ user_id: "non existing id" });

        }).rejects.toBeInstanceOf(GetBalanceError);
    })
})