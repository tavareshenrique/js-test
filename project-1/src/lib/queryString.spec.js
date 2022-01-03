const { queryString, parse } = require('./queryString');

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

describe('Query string to object', () => {
  it('should convert a query string to object', () => {
    const qs = 'name=Henrique&age=25';

    expect(parse(qs)).toEqual({
      name: 'Henrique',
      age: '25',
    });
  });

  it('should convert a query string of a single key-value pair to object', () => {
    const qs = 'name=Henrique';

    expect(parse(qs)).toEqual({
      name: 'Henrique',
    });
  });

  it('should convert a query string to an object taking care of comma separated values', () => {
    const qs = 'name=Henrique&abilities=JS,TS';

    expect(parse(qs)).toEqual({
      name: 'Henrique',
      abilities: ['JS', 'TS'],
    });
  });
});
