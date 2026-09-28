export interface MockRouteRequestInput {
  method: string;
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
}
