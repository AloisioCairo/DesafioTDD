import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

// A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.

describe("should return info the user authenticat", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
      })
    
      it("should be able to create a new user", async () => {
        const user = {
          name: "aloisio",
          email: "aloisio@teste5.com.br",
          password: "123",
        }
    
        const passwordHash = await hash(user.password, 8);
    
        await createUserUseCase.execute({
          name: user.name,
          email: user.email,
          password: passwordHash,
        });
    
        const userCreated = await inMemoryUsersRepository.findByEmail(user.email);
        const showUser = await showUserProfileUseCase.execute(String(userCreated?.id));

        expect(showUser).toHaveProperty("id");
        expect(showUser).toHaveProperty("name");
        expect(showUser).toHaveProperty("email");
        expect(showUser).toHaveProperty("password");
    })
})