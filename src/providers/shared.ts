import type { JWTPayload } from 'jose';
import type {
  Request as WorkerRequest,
  IncomingRequestCfProperties,
  D1Database,
  ExecutionContext,
} from '@cloudflare/workers-types';

export type ProviderEnv = {
  DB: D1Database;
  AUTH_ISSUER: string;
  EXTENSION_CONFIG?: string; // JSON string containing arbitrary data the extension needs
};

export enum AuthType {
  OAuth = 'oauth',
  ApiKey = 'api_key',
}

export enum Scope {
  RuntRead = 'runt:read',
  RuntExecute = 'runt:execute',
}

export type User = {
  id: string;
  email: string;
  name?: string;
  givenName?: string;
  familyName?: string;
};

export type Resource = {
  id: string;
  type: string;
};

export type Passport = {
  type: AuthType;
  user: User;
  claims: JWTPayload;
  scopes: Scope[] | null;
  resources: Resource[] | null;
};

export type ProviderContext = {
  request: WorkerRequest<unknown, IncomingRequestCfProperties<unknown>>;
  env: ProviderEnv;
  ctx: ExecutionContext;
  bearerToken: string | null;
  passport: Passport | null;
};

// https://github.com/microsoft/TypeScript/issues/28374
type NonNullableValues<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
export type AuthenticatedProviderContext = NonNullableValues<ProviderContext>;
