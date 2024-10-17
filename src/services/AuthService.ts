import ApiService from "./ApiService";
import type {
  SignInCredential,
  SignUpCredential,
  ForgotPassword,
  ResetPassword,
  SignInResponse,
  SignUpResponse,
  UserResponse,
  RegisterCredential,
} from "@/@types/auth";

export async function apiSignIn(data: SignInCredential) {
  return ApiService.fetchData<SignInResponse>({
    url: "/sign-in",
    method: "post",
    data,
  });
}

export async function apiGetUser() {
  try {
    return ApiService.fetchData<UserResponse>({
      url: "/users/me",
      method: "get",
    });
  } catch (error) {
    return {
      data: {},
    };
  }
}

export async function apiRegisterAccount(data: RegisterCredential) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, (data as any)[key]);
  });

  return ApiService.fetchData<any>({
    url: "/users",
    method: "post",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function apiSignUp(data: SignUpCredential) {
  return ApiService.fetchData<SignUpResponse>({
    url: "/sign-up",
    method: "post",
    data,
  });
}

export async function apiSignOut() {
  return ApiService.fetchData({
    url: "/sign-out",
    method: "post",
  });
}

export async function apiForgotPassword(data: ForgotPassword) {
  return ApiService.fetchData({
    url: "/forgot-password",
    method: "post",
    data,
  });
}

export async function apiResetPassword(data: ResetPassword) {
  return ApiService.fetchData({
    url: "/reset-password",
    method: "post",
    data,
  });
}
