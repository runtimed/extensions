import type { Response as WorkerResponse } from '@cloudflare/workers-types';
import type { Passport, ProviderContext, Scope, Resource, AuthenticatedProviderContext } from './shared';

export enum ApiKeyCapabilities {
  Revoke = 'revoke',
  Delete = 'delete',
  CreateWithResources = 'create_with_resources',
}

export type CreateApiKeyRequest = {
  scopes: Scope[];
  resources?: Resource[];
  expiresAt: string;
  name?: string;
  userGenerated: boolean;
};

export type ApiKey = CreateApiKeyRequest & {
  id: string;
  userId: string;
  revoked: boolean;
};

export type ListApiKeysRequest = {
  limit?: number;
  offset?: number;
};

export type ApiKeyProvider = {
  capabilities: Set<ApiKeyCapabilities>;
  overrideHandler?: (context: ProviderContext) => Promise<false | WorkerResponse>; // Any routes the provider wants to fully implement. Return false for any route not handled
  isApiKey(context: ProviderContext): boolean; // Returns true if the auth token appears to be an API key (whether or not it is valid)
  validateApiKey(context: ProviderContext): Promise<Passport>; // Ensure the API key is valid, and returns the Passport. Raise an error otherwise
  createApiKey: (context: AuthenticatedProviderContext, request: CreateApiKeyRequest) => Promise<string>;
  getApiKey: (context: AuthenticatedProviderContext, id: string) => Promise<ApiKey>; // Returns the API key matching the specific api key id
  listApiKeys: (context: AuthenticatedProviderContext, request: ListApiKeysRequest) => Promise<ApiKey[]>; // Return a list of all API keys for a user
  revokeApiKey: (context: AuthenticatedProviderContext, id: string) => Promise<void>; // set the revoked flag for an API key, such that it will no longer be valid
  deleteApiKey: (context: AuthenticatedProviderContext, id: string) => Promise<void>; // Delete an API key from the database
};
