module.exports = {
  intoData({ message, status, data }) {
    return {
      message: message ?? 'success',
      data,
      status: status ?? 200,
    };
  },
};
