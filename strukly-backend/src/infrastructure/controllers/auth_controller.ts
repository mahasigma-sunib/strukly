import { Request, Response } from 'express';
import RegisterUserUseCase from '../../application/use_cases/register_user';
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase
  ) {}

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'bad request' });
      }

      await this.registerUserUseCase.execute(email, password, name);
      return res.status(201).json({ message: 'user created successfully' });

    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error' });
    }
  };
}