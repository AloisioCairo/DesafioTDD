import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

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

    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository);
  })

  // A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações 
  //   de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.
  
  it("should be able to get balance", async () => {
    const user = {
      name: "aloisio",
      email: "aloisio@teste1.com.br",
      password: "123",
    }

    const passwordHash = await hash(user.password, 8);

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: passwordHash,
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    const stantement = await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "Bebidas"
    });
    
    var idUser = stantement.user_id;

    const stantement1 = await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.WITHDRAW,
      amount: 5,
      description: "Bebidas"
    });
    
    idUser = stantement1.user_id;

    const balance = await getBalanceUseCase.execute({ user_id: idUser });

    expect(balance).toHaveProperty("balance");
  })
})
