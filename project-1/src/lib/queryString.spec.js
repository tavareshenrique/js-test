const { queryString } = require('./queryString');

describe('Object to query string', () => {
  it('should create a valid query string when a object is provided', () => {
    const obj = {
      name: 'Henrique',
      age: '25',
    };

    expect(queryString(obj)).toBe('name=Henrique&age=25');
  });

  it('should create a valid query string even when an array is passed as value', () => {
    const obj = {
      name: 'Henrique',
      abilities: ['React', 'TypeScript'],
    };

    expect(queryString(obj)).toBe('name=Henrique&abilities=React,TypeScript');
  });

  it('should throw an error when an object is passed as value', () => {
    const obj = {
      name: 'Henrique',
      abilities: {
        first: 'React',
        second: 'TypeScript',
      },
    };

    expect(() => {
      queryString(obj);
    }).toThrowError();
  });
});

// describe(('Query string to object') => {

// })
