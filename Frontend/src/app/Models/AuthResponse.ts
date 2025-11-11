import { UserResponse } from './UserResponse';

export interface AuthResponse {
  token: string;
  tipo: string;
  usuario: UserResponse;
}
