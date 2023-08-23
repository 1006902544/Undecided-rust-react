const auth = async (ctx, next) => {
  if (toggleUnless(ctx)) {
    await next();
  } else {
    if (ctx.header.authorization) {
      await next();
    } else {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: 'Auth Error',
      };
    }
  }
};

module.exports = auth;

const unless = [
  {
    regex: /^\/openapi.*$/,
    methods: ['GET'],
  },
];

const toggleUnless = (ctx) => {
  const { method } = ctx.request;
  const { path } = ctx;
  return unless.some(({ methods, regex }) => {
    if (regex.test(path)) {
      return methods.includes(method);
    } else {
      return false;
    }
  });
};
