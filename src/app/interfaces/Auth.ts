export interface IUser {
  id?: string | number;
  email: string;
  password: string;
  forgotPassword?: boolean;
  confirmPassword?: boolean;
  role?: string;
}
