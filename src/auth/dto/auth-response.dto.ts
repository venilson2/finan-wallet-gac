import { AuthUser } from "./auth-user.dto";

export class AuthResponseDto {
  token: string;
  user: AuthUser;
  expires_in: number;
}