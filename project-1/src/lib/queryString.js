module.exports.queryString = obj =>
  Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        throw new Error('Objects are not allowed as values');
      }

      return `${key}=${value}`;
    })
    .join('&');
