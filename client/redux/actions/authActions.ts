import { Dispatch } from "redux";
import authService from "../../services/authService";

export const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
export const LOGIN_FAILURE = "auth/LOGIN_FAILURE";
export const LOGOUT = "auth/LOGOUT";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: User;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthAction = LoginSuccessAction | LoginFailureAction | LogoutAction;

export const loginSuccess = (user: User): AuthAction => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (): AuthAction => ({
  type: LOGIN_FAILURE,
});

export const logout = (): AuthAction => ({
  type: LOGOUT,
});

export const login =
  (email: string, password: string) =>
    async (dispatch: Dispatch<AuthAction>) => {
      try {
        const response = await authService.login({ email, password });
        const { success, firstName, lastName, id } = response.data;

        if (success) {
          dispatch(
            loginSuccess({ firstName: firstName, lastName: lastName, id: id })
          );
        } else {
          dispatch(loginFailure());
        }
      } catch (error) {
        dispatch(loginFailure());
      }
    };
