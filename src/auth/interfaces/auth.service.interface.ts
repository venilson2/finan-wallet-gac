import { AuthResponseDto } from "../dto/auth-response.dto";
import { AuthDto } from "../dto/auth.dto";

export interface IAuthService {
  signIn(userDTO: AuthDto): Promise<AuthResponseDto>;
}
