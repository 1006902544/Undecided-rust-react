module.exports = {
  manager: {
    input: {
      target: 'http://127.0.0.1:8080/manager/api-docs/openapi.json',
    },
    output: {
      target: './src/libs/api/index.ts',
      schemas: './src/libs/api/schema',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/libs/api/custom_instance.ts',
          name: 'custom_instance',
        },

        operations: {
          //获取用户信息
          getAdminInfo: {
            query: {
              useQuery: true,
            },
          },
          //获取用户路由menu
          getRouter: {
            query: {
              useQuery: true,
            },
          },
          //获取全部路由menu
          getAllRouter: {
            query: {
              useQuery: true,
            },
          },
          getCompanyDetail: {
            query: {
              useQuery: true,
            },
          },
          getImages: {
            query: {
              useQuery: true,
            },
          },
        },
      },
    },
  },
  bff: {
    input: {
      target: 'http://127.0.0.1:8081/openapi/doc',
    },
    output: {
      target: './src/libs/api/bff/index.ts',
      schemas: './src/libs/api/bff/schema',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/libs/api/bff/custom_instance.ts',
          name: 'custom_instance',
        },
      },
    },
  },
};
