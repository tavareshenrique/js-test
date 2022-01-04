import find from 'lodash/find';
import remove from 'lodash/remove';
import Money from 'dinero.js';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

export interface Item {
  product: {
    title: string;
    price: number;
  };
  quantity: number;
  condition?: {
    percentage: number;
    minimum: number;
  };
}

export default class Cart {
  items: Item[] = [];

  add(item: Item) {
    if (find(this.items, { product: item.product })) {
      remove(this.items, { product: item.product });
    }

    this.items.push(item);
  }

  remove(item: Item) {
    remove(this.items, { product: item.product });
  }

  getTotal() {
    return this.items.reduce((acc, item) => {
      const amount = Money({ amount: item.quantity * item.product.price });

      let discount = Money({ amount: 0 });

      if (item.condition && item.quantity > item.condition.minimum) {
        discount = amount.percentage(item.condition.percentage);
      }

      return acc.add(amount).subtract(discount);
    }, Money({ amount: 0 }));
  }

  summary() {
    const total = this.getTotal().getAmount();
    const items = this.items;

    return {
      total,
      items,
    };
  }

  checkout() {
    const { total, items } = this.summary();

    this.items = [];

    return {
      total,
      items,
    };
  }
}
