import jwt from "jsonwebtoken";
import TokenService from "../../domain/services/token_service";

export default class JwtService implements TokenService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'nefjnwnfjpwnf32872189047214dididkfhuufiheu832hthisisgoodenough';
  async generate(payload: { id: string; email: string; }): Promise<string> {
      const jwtToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' })
      return jwtToken
  }
  
  async verify(token: string): Promise<{ id: string; email: string; }> {
    try {
      const payload = jwt.verify(token, this.jwtSecret);

      if (typeof payload === 'object' && 'id' in payload && 'email' in payload) {
          return payload as { id: string, email: string };
      }
      throw new Error('Invalid token payload');

    } catch (error) {
      throw new Error('Invalid or expired token.');
    }
  }
}