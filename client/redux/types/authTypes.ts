export interface User {
  id: string;
  name: string;
}

export interface LoginAction {
  type: "auth/login";
  payload: {
    email: string;
    password: string;
  };
}

export interface LogoutAction {
  type: "auth/logout";
}

export type AuthAction = LoginAction | LogoutAction;
