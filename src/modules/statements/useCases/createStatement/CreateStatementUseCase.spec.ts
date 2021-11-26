import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
  })

  it("should be able to create a new statement", async () => {
    const user = {
      name: "aloisio",
      email: "aloisio@teste.com.br",
      password: "123",
    }

    const passwordHash = await hash(user.password, 8);

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: passwordHash,
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    const statement = await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "Bebidas"
    });

    expect(statement).toHaveProperty("id");
  })

  it("should be able to create a new statement with insufficientfunds", async () => {
    expect(async () => {
      const user = {
        name: "aloisio",
        email: "aloisio@teste.com.br",
        password: "123",
      }

      const passwordHash = await hash(user.password, 8);

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: passwordHash,
      });

      const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

      await createStatementUseCase.execute({
        user_id: userCreated?.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Bebidas"
      });

      await createStatementUseCase.execute({
        user_id: userCreated?.id as string,
        type: OperationType.WITHDRAW,
        amount: 250,
        description: "Restaurante"
      });

    }).rejects.toBeInstanceOf(new CreateStatementError.InsufficientFunds());
  })
})
