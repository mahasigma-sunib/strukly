import User from "../aggregates/user"

export default interface UserRepository{
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
}