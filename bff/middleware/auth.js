const auth = async (ctx, next) => {
  if (ctx.header.authorization) {
    await next();
  } else {
    ctx.status = 401;
    ctx.body = {
      status: 401,
      message: 'Auth Error',
    };
  }
};

module.exports = auth;
