module.exports.queryString = obj => {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&');
};
