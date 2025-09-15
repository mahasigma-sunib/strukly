import User from "../aggregates/user"

export default interface UserRepository{
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}