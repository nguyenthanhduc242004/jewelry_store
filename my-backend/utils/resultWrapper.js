function resultWrapper(isSuccess, statusCode, message, data = null, metadata = {}) {
  return {
    isSuccess,
    statusCode,
    message,
    data,
    metadata
  };
}

module.exports = resultWrapper;