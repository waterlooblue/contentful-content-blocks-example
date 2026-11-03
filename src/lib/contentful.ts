// Minimal client for Contentful's GraphQL Content API.
// It has no framework or build-tool dependencies: it only needs `fetch`, so the
// same code runs in the browser, in Node 18+, or in a server framework.

export interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  environment?: string;
  // When true, queries return draft content. `accessToken` must then be a
  // Content Preview API token.
  preview?: boolean;
}

export interface ContentfulClient {
  query<T>(query: string, variables?: Record<string, unknown>, signal?: AbortSignal): Promise<T>;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export function createContentfulClient(config: ContentfulConfig): ContentfulClient {
  const environment = config.environment || 'master';
  const preview = Boolean(config.preview);
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${config.spaceId}/environments/${environment}`;

  return {
    async query<T>(query: string, variables: Record<string, unknown> = {}, signal?: AbortSignal) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.accessToken}`,
        },
        body: JSON.stringify({ query, variables: { preview, ...variables } }),
        signal,
      });

      const body = (await response.json().catch(() => ({}))) as GraphQLResponse<T>;
      if (!response.ok || body.errors?.length || !body.data) {
        const details = body.errors?.map((e) => e.message).join('; ') || response.statusText;
        throw new Error(`Contentful query failed (${response.status}): ${details}`);
      }
      return body.data;
    },
  };
}
