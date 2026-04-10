export type { Language } from "./language";
export type {
  ContentEntry,
  ContentValueType,
  HomeContentResponse,
  LanguagesAdminResponse,
  LanguagesResponse,
} from "./content";

export interface AuthMeResponse {
  user: {
    id: string;
    login: string;
  };
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  ok: boolean;
}

export interface ApiErrorBody {
  error: string;
}
