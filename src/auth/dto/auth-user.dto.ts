export class AuthUser {
  id: string;
  name: string;
  email: string;
  account: {
    id: string,
    balance: number,
  }
  iat?: number;
  exp?: number;
}