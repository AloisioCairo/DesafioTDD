import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

// A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário 
// autenticado junto à um token JWT.

interface IRequest {
    email: string;
    password: string;
  }

describe("should return info the user authenticat", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
      })
    
      it("should be able to create a new user", async () => {
        const user = {          
          name: "aloisio",
          email: "aloisio@teste3.com.br",
          password: "123",
        }
    
        const passwordHash = await hash(user.password, 8);
    
        const user1 = await createUserUseCase.execute({
          name: user.name,
          email: user.email,
          password: passwordHash,
        });

        const userCreated = await inMemoryUsersRepository.findByEmail(user1.email);

        const email = user1.email
        const passwordTemp = user1.password;

        const infoUserToken = await authenticateUserUseCase.execute({email, password: passwordTemp});

        expect(infoUserToken).toHaveProperty("id");
    })
})