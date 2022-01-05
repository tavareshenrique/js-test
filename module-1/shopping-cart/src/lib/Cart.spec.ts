import Cart, { Item } from './Cart';

describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal().getAmount()', () => {
    it('should return 0 when getTotal().getAmount() is executed in a newly created instance', () => {
      expect(cart.getTotal().getAmount()).toEqual(0);
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

      expect(cart.getTotal().getAmount()).toEqual(70776);
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

      expect(cart.getTotal().getAmount()).toEqual(35388);
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

      expect(cart.getTotal().getAmount()).toEqual(41872);
    });
  });

  describe('checkout()', () => {
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

      expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
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

      expect(cart.getTotal().getAmount()).toEqual(0);
    });
  });

  describe('special conditions', () => {
    it('should apply percentage discount quantity above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      const product1 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        condition,
        quantity: 3,
      } as Item;

      cart.add(product1);

      expect(cart.getTotal().getAmount()).toEqual(74315);
    });

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      };

      const product1 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        condition,
        quantity: 4,
      } as Item;

      cart.add(product1);

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });

    it('should apply quantity discount for odd quantities', () => {
      const condition = {
        quantity: 2,
      };

      const product1 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        condition,
        quantity: 5,
      } as Item;

      cart.add(product1);

      expect(cart.getTotal().getAmount()).toEqual(106164);
    });

    it('should NOT apply percentage discount quantity is below or equals minimum', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      const product1 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        condition,
        quantity: 2,
      } as Item;

      cart.add(product1);

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });

    it('should NOT apply quantity discount for even quantities when condition is not minimum', () => {
      const condition = {
        quantity: 2,
      };

      const product1 = {
        product: {
          title: 'Adidas Shoes',
          price: 35388, //353.88 | R$ 353,88
        },
        condition,
        quantity: 1,
      } as Item;

      cart.add(product1);

      expect(cart.getTotal().getAmount()).toEqual(35388);
    });
  });
});
