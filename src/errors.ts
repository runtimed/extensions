export enum ErrorType {
  Unknown = 'unknown',
  MissingAuthToken = 'missing_token',
  AuthTokenInvalid = 'invalid_token',
  AuthTokenWrongSignature = 'wrong_signature',
  AuthTokenExpired = 'expired_token',
  AccessDenied = 'access_denied',
  NotFound = 'not_found',
  ServerMisconfigured = 'server_misconfigured',
  InvalidRequest = 'invalid_request',
  CapabilityNotAvailable = 'capability_not_available',
}
type StatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500;

const StatusCodeMapping: Record<ErrorType, StatusCode> = {
  [ErrorType.InvalidRequest]: 400,
  [ErrorType.CapabilityNotAvailable]: 400,
  [ErrorType.MissingAuthToken]: 401,
  [ErrorType.AuthTokenInvalid]: 401,
  [ErrorType.AuthTokenExpired]: 401,
  [ErrorType.AuthTokenWrongSignature]: 401,
  [ErrorType.AccessDenied]: 403,
  [ErrorType.NotFound]: 404,
  [ErrorType.ServerMisconfigured]: 500,
  [ErrorType.Unknown]: 500,
};

type ExtensionErrorOptions = {
  message?: string; // User-friendly message describing what happened
  responsePayload?: Record<string, unknown>; // Extra JSON data to be returned to the client
  debugPayload?: Record<string, unknown>; // Extra JSON data for debugging. Not returned to the client in production
  cause?: Error; // The underlying error, if any
};

export type ErrorPayload = {
  type: ErrorType;
  message: string;
  data: Record<string, unknown>;
  debug?: {
    stack?: string;
    underlying?: {
      message: string;
      stack?: string;
    };
  } & Record<string, unknown>;
};

export class RuntError extends Error {
  constructor(
    public type: ErrorType,
    private options: ExtensionErrorOptions
  ) {
    super(options.message ?? `RuntError: ${type}`, { cause: options.cause });
  }

  get statusCode(): StatusCode {
    return StatusCodeMapping[this.type];
  }

  public getPayload(debug: boolean): ErrorPayload {
    const underlying =
      this.cause instanceof Error
        ? {
            message: this.cause.message,
            stack: this.cause.stack,
          }
        : undefined;
    return {
      type: this.type,
      message: this.message,
      data: this.options.responsePayload ?? {},
      debug: debug
        ? {
            stack: this.stack,
            underlying,
            ...this.options.debugPayload,
          }
        : undefined,
    };
  }
}
