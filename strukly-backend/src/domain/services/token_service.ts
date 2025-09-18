export default interface TokenService {
  generate(payload: { id: string; email: string }): Promise<string>;
  verify(token: string): Promise<{ id: string; email: string }>
}