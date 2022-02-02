import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create a new user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async () => {
    const user = {
      name: "aloisio",
      email: "aloisio@teste4.com.br",
      password: "123",
    }

    const passwordHash = await hash(user.password, 8);

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: passwordHash,
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  })

  it("should be able to create a new user with name exists", async () => {
    expect(async () => {
      const user = {
        name: "aloisio",
        email: "aloisio@teste4.com.br",
        password: "123",
      }

      const passwordHash = await hash(user.password, 8);

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: passwordHash,
      });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: passwordHash,
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
