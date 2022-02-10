import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

export class AuthenticateUserController {
  async execute(request: Request, response: Response) {
    const { email, password } = request.body;

    console.log("email__" + email);
    console.log("password__" + password);

    const authenticateUser = container.resolve(AuthenticateUserUseCase);

    console.log("2222");

    const { user, token } = await authenticateUser.execute({
      email,
      password
    });

    console.log("3333");

    return response.json({ user, token });
  }
}
