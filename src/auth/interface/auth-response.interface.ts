export interface AuthResponse {
  // user: Pick<User, 'username' | 'email'>;
  // token: string;

  statusCode: string;
  message: string;
  access_token?: string;
}
