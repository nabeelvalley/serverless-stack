import {
  Api,
  StackContext,
  Table,
  ViteStaticSite,
} from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "Counter", {
    fields: {
      counter: "string",
    },
    primaryIndex: { partitionKey: "counter" },
  });

  // Create a HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        // Allow the API to access the table
        permissions: [table],
        // Pass in the table name to our API
        environment: {
          tableName: table.tableName,
        },
      },
    },
    routes: {
      "POST /": "lambda.main",
    },
  });

  // Deploy our Svelte app
  const site = new ViteStaticSite(stack, "SvelteJSSite", {
    path: "frontend",
    environment: {
      // Pass in the API endpoint to our app
      VITE_APP_API_URL: api.url,
    },
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}
