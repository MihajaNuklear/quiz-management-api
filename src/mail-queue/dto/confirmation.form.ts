export interface ConfirmationForm {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  gender: string;
}

export interface ResetPasswordForm {
  token: string;
  email: string;
}
