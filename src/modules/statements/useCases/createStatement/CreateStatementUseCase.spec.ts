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

  // A rota recebe um token JWT pelo header e amount e description no corpo da requisição, registra a operação de depósito 
  //   do valor e retorna as informações do depósito criado com status 201.

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
      amount: 160,
      description: "Bebidas"
    });

    expect(statement).toHaveProperty("id");
  })

  // A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do 
  //   valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`. 

  it("should be able to create a new statement", async () => {
    const user = {
      name: "aloisio11",
      email: "aloisio11@teste.com.br",
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
      amount: 230,
      description: "Vendas"
    });

    // const statement = '';
    const statement1 = await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.WITHDRAW,
      amount: 130,
      description: "Alimentos"
    });

    expect(statement1).toHaveProperty("id");
  })

  // it("should be able to create a new statement with insufficientfunds", async () => {
  //   expect(async () => {
  //     const user = {
  //       name: "aloisio8",
  //       email: "aloisio@teste8.com.br",
  //       password: "123",
  //     }

  //     const passwordHash = await hash(user.password, 8);

  //     await createUserUseCase.execute({
  //       name: user.name,
  //       email: user.email,
  //       password: passwordHash,
  //     });

  //     const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

  //     const deposito = await createStatementUseCase.execute({
  //       user_id: userCreated?.id as string,
  //       type: OperationType.DEPOSIT,
  //       amount: 400,
  //       description: "Bebidas"
  //     });

  //     const saque = await createStatementUseCase.execute({
  //       user_id: userCreated?.id as string,
  //       type: OperationType.WITHDRAW,
  //       amount: 450,
  //       description: "Restaurante"
  //     });
  //   }).rejects.toBeInstanceOf(new CreateStatementError.InsufficientFunds());
  // })
})
