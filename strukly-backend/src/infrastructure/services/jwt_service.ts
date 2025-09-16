import jwt from "jsonwebtoken";
import TokenService from "../../domain/services/token_service";

export class JwtService implements TokenService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'nefjnwnfjpwnf32872189047214dididkfhuufiheu832hthisisgoodenough';
  async generate(payload: { id: string; email: string; }): Promise<string> {
      const jwtToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' })
      return jwtToken
  }
}