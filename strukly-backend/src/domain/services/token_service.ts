export default interface TokenService {
  generate(payload: { id: string; email: string }): Promise<string>;
}