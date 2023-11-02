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
          getManagerInfoByToken: {
            query: {
              useQuery: true,
            },
          },
          //获取用户路由menu
          getCurrentRoleRouter: {
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
          getSpuDetail: {
            query: {
              useQuery: true,
            },
          },
          //获取c端用户详情
          getUserDetail: {
            query: {
              useQuery: true,
            },
          },
          //获取活动详情
          getActivityDetail: {
            query: {
              useQuery: true,
            },
          },
          //获取活动商品
          getActivityGoodsLimit: {
            query: {
              useQuery: true,
            },
          },
          //管理端角色分页
          getManagerRoles: {
            query: {
              useQuery: true,
            },
          },
          //获取当前登录用户角色审核申请
          getCurrentRoleAudit: {
            query: {
              useQuery: true,
            },
          },
          //获取商城新闻
          getNews: {
            query: {
              useQuery: true,
            },
          },
          //获取商城轮播
          getCarousel: {
            query: {
              useQuery: true,
            },
          },
          //获取商城热门活动
          getHotActivity: {
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
