module.exports.queryString = obj =>
  Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&');
