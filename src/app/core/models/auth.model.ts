/** The logged-in website member (from Umbraco). */
export interface Member {
  id: string;
  name: string;
  email: string;
  roles: string[];   // ← add
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}