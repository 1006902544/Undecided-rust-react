module.exports = {
  admin: {
    input: {
      target: 'http://127.0.0.1:8080/admin/api-docs/openapi.json',
    },
    output: {
      target: './src/libs/api/admin/index.ts',
      schemas: './src/libs/api/admin/schema',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/libs/api/custom_instance.ts',
          name: 'custom_instance',
        },

        operations: {
          getAdminInfo: {
            query: {
              useQuery: true,
            },
          },
        },
      },
    },
  },
};
