import type { ReactNode } from 'react';

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  expiresAt: string | null;
  email: string;
};

export type AuthSessionLike = {
  accessToken?: unknown;
  access_token?: unknown;
  tokenType?: unknown;
  token_type?: unknown;
  expiresAt?: unknown;
  expires_at?: unknown;
  email?: unknown;
} | null | undefined;

export type AuthState =
  | {
      status: 'anonymous' | 'hydrating';
      session: null;
    }
  | {
      status: 'authenticated';
      session: AuthSession;
    };

export type AuthContextValue = {
  authState: AuthState;
  currentUserEmail: string | null;
  /* email da sessão autenticada atual quando disponível */
  session: AuthSession | null;
  /* null quando não há sessão válida
  AuthSession quando a sessão está ativa*/
  isAuthenticated: boolean;
  /* false em hydrating e anonymous
  true em authenticated*/
  isHydrated: boolean;
  /* false enquanto o AuthProvider ainda está lendo o localStorage
  true depois que a hidratação termina */
  setSessionFromLogin: (loginResult: unknown) => AuthSession | null;
  /* normaliza a resposta do login e persiste a sessão*/
  logout: () => Promise<void>;
  /* faz o logout remoto quando existe sessão atual e conclui limpando a sessão local no frontend*/
};

export type AuthProviderProps = {
  children: ReactNode;
};
