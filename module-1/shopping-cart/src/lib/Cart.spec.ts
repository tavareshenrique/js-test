import Cart, { Item } from './Cart';

describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created instance', () => {
      expect(cart.getTotal()).toEqual(0);
    });

    it('should multiply quantity and price and receive the total amount', () => {
      const item = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        quantity: 2,
      } as Item;

      cart.add(item);

      expect(cart.getTotal()).toEqual(70776);
    });

    it('should ensure no more than on product exists at a time', () => {
      const item1 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        quantity: 2,
      } as Item;

      cart.add(item1);

      const item2 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        quantity: 1,
      } as Item;

      cart.add(item2);

      expect(cart.getTotal()).toEqual(35388);
    });

    it('should ensure no more thanm on product exists at a time', () => {
      const product1 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        quantity: 2,
      } as Item;

      const product2 = {
        product: {
          title: 'Adidas Shoes Women',
          price: 41872, //353.88 | R$ 353,88
        },
        quantity: 1,
      } as Item;

      cart.add(product1);

      cart.add(product2);

      cart.remove(product1);

      expect(cart.getTotal()).toEqual(41872);
    });
  });

  describe('checkout', () => {
    it('should return object with the total and the list of items', () => {
      const product1 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        quantity: 2,
      } as Item;

      const product2 = {
        product: {
          title: 'Adidas Shoes Women',
          price: 41872, //353.88 | R$ 353,88
        },
        quantity: 3,
      } as Item;

      cart.add(product1);

      cart.add(product2);

      expect(cart.checkout()).toMatchInlineSnapshot(`
        Object {
          "items": Array [
            Object {
              "product": Object {
                "price": 35388,
                "title": "Adidas Shoes",
              },
              "quantity": 2,
            },
            Object {
              "product": Object {
                "price": 41872,
                "title": "Adidas Shoes Women",
              },
              "quantity": 3,
            },
          ],
          "total": 196392,
        }
      `);
    });

    it('should return object with the total and the list of items when summary() is called', () => {
      const product1 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        quantity: 2,
      } as Item;

      const product2 = {
        product: {
          title: 'Adidas Shoes Women',
          price: 41872, //353.88 | R$ 353,88
        },
        quantity: 3,
      } as Item;

      cart.add(product1);

      cart.add(product2);

      expect(cart.getTotal()).toBeGreaterThan(0);
      expect(cart.summary()).toMatchInlineSnapshot(`
        Object {
          "items": Array [
            Object {
              "product": Object {
                "price": 35388,
                "title": "Adidas Shoes",
              },
              "quantity": 2,
            },
            Object {
              "product": Object {
                "price": 41872,
                "title": "Adidas Shoes Women",
              },
              "quantity": 3,
            },
          ],
          "total": 196392,
        }
      `);
    });

    it('should reset cart when checkout() is called', () => {
      const product2 = {
        product: {
          title: 'Adidas Shoes Women',
          price: 41872, //353.88 | R$ 353,88
        },
        quantity: 3,
      } as Item;

      cart.add(product2);

      cart.checkout();

      expect(cart.getTotal()).toEqual(0);
    });
  });
});
