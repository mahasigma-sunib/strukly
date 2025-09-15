import HashingService from "../ports/hashing_service_port";
import * as bcrypt from 'bcrypt';

export class BcryptService implements HashingService {
  private readonly saltRounds = 12;

  async hash(plainText: string): Promise<string> {
    const result = await bcrypt.hash(plainText, this.saltRounds)
    return result
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    const ok = await bcrypt.compare(plainText, hash)
    return ok
  }
}