import User from "../aggregates/user"

export interface UserRepository{
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}