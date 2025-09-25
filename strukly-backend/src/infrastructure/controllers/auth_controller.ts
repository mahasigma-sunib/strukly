import { Request, Response } from "express";
import RegisterUserUseCase from "../../application/use_cases/register_user";
import LoginUserUseCase from "../../application/use_cases/user_login";
import TokenService from "../../domain/services/token_service";

export default class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly tokenService: TokenService
  ) {}

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "bad request" });
      }

      await this.registerUserUseCase.execute(email, password, name);
      return res.status(201).json({ message: "user created successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: "internal server error" });
    }
  };

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "bad request" });
      }

      const user = await this.loginUserUseCase.execute(email, password);
      const token = await this.tokenService.generate({
        id: user.id,
        email: user.email,
      });

      res.cookie("access_token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
        path: "/",
      });

      return res.status(200).json({ message: "login successful" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: "internal server error" });
    }
  };
}
