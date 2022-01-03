const { queryString } = require('./queryString');

describe('Object to query string', () => {
  it('should create a valid query string when a object is provided', () => {
    const obj = {
      name: 'Henrique',
      age: '25',
    };

    expect(queryString(obj)).toBe('name=Henrique&age=25');
  });
});

// describe(('Query string to object') => {

// })
