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

  it('should add 2 products to the list and open the cart', async () => {
    const products = server.createList('product', 2);

    const { actions: { add } } = result.current;

    for (const product of products) {
      act(() => {
        add(product);
      })
    }

    expect(result.current.state.products).toHaveLength(2);
    expect(result.current.state.open).toBe(true);
  });

  it('should assign 1 as initial quntity on product add()', async () => {
    const product = server.create('product');

    const { actions: { add } } = result.current;

    act(() => {
      add(product);
    })

    expect(result.current.state.products[0].quantity).toBe(1);
  });

  it('should increase quantity', () => {
    const product = server.create('product');

    const { actions: { add, increase } } = result.current;

    act(() => {
      add(product);
      increase(product);
    })

    expect(result.current.state.products[0].quantity).toBe(2);
  })

  it('should decrease quantity', () => {
    const product = server.create('product');

    const { actions: { add, decrease } } = result.current;

    act(() => {
      add(product);
      decrease(product);
    })

    expect(result.current.state.products[0].quantity).toBe(0);
  })

  it('should NOT decrease below zero', () => {
    const product = server.create('product');

    const { actions: { add, decrease } } = result.current;

    act(() => {
      add(product);
      decrease(product);
      decrease(product);
    })

    expect(result.current.state.products[0].quantity).toBe(0);
  })

  it('should not add same product twice', () => {
    const product = server.create('product');

    const { actions: { add } } = result.current;

    act(() => add(product));
    act(() => add(product));

    expect(result.current.state.products).toHaveLength(1);
  })

  it('should toggle open state', () => {
    const { actions: { toggle } } = result.current;

    expect(result.current.state.open).toBe(false);
    expect(result.current.state.products).toHaveLength(0);

    act(() =>  toggle());
    expect(result.current.state.open).toBe(true);

    act(() =>  toggle());
    expect(result.current.state.open).toBe(false);

    expect(result.current.state.products).toHaveLength(0);
  });

  it('should remove a product from the store', () => {
    const [product1, product2] = server.createList('product', 2);

    const { actions: { add, remove } } = result.current;

    act(() => {
      add(product1);
      add(product2);
    })

    expect(result.current.state.products).toHaveLength(2);

    act(() => {
      remove(product1);
    })

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.products[0]).toEqual(product2);
  });

  it('should not change products in the cart if provided is not in the array', () => {
    const [product1, product2, product3] = server.createList('product', 3);

    const { actions: { add, remove } } = result.current;

    act(() => {
      add(product1);
      add(product2);
    })

    expect(result.current.state.products).toHaveLength(2);

    act(() => {
      remove(product3);
    })

    expect(result.current.state.products).toHaveLength(2);
  });

  it('should clear cart', () => {
    const products = server.createList('product', 2);

    const { actions: { add, removeAll } } = result.current;

    act(() => {
      for (const product of products) {
        add(product);
      }
    });

    expect(result.current.state.products).toHaveLength(2);

    act(() => {
      removeAll();
    })

    expect(result.current.state.products).toHaveLength(0);
  })
})