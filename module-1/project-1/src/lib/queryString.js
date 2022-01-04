const keyValueToString = ([key, value]) => {
  if (typeof value === 'object' && !Array.isArray(value)) {
    throw new Error('Objects are not allowed as values');
  }

  return `${key}=${value}`;
};

export function queryString(obj) {
  return Object.entries(obj).map(keyValueToString).join('&');
}

export function parse(string) {
  return Object.fromEntries(
    string.split('&').map(keyValue => {
      let [key, value] = keyValue.split('=');

      if (value.indexOf(',') !== -1) {
        value = value.split(',');
      }

      return [key, value];
    }),
  );
}
