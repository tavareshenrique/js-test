import { renderHook, act } from '@testing-library/react-hooks';
import { makeServer } from '../../miragejs/server'

import { useCartStore } from './';

describe('Cart Store', () => {
  let server;
  let result;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
  });

  afterEach(() => {
    server.shutdown();
    act(() => {
      result.current.actions.reset();
    })
  })

  it('should return open equals false on initial state', () => {
    expect(result.current.state.open).toBe(false);
  });

  it('should return an empty array for products on initial state', () => {
    expect(Array.isArray(result.current.state.products)).toBe(true);
    expect(result.current.state.products).toHaveLength(0);
  });

  it('should add 2 products to the list', async () => {
    const products = server.createList('product', 2);

    const { actions: { add } } = result.current;

    for (const product of products) {
      act(() => {
        add(product);
      })
    }

    expect(result.current.state.products).toHaveLength(2);
  });

  it('should toggle open state', () => {
    const { actions: { toggle } } = result.current;

    act(() =>  toggle());
    expect(result.current.state.open).toBe(true);

    act(() =>  toggle());
    expect(result.current.state.open).toBe(false);
  });
})