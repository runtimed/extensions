import type { ApiKeyProvider } from './providers/api_key';
export type * from './providers/shared';
export * from './errors';

export type BackendExtension = {
  apiKey?: ApiKeyProvider;
};
