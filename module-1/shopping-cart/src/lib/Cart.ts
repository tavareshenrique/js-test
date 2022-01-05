import find from 'lodash/find';
import remove from 'lodash/remove';
import Money, { Dinero } from 'dinero.js';

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
    quantity?: number;
  };
}

export default class Cart {
  items: Item[] = [];

  _calculatePercentageDiscount(amount: Dinero, item: Item) {
    if (item.condition && item.quantity > item.condition.minimum) {
      return amount.percentage(item.condition.percentage);
    }

    return Money({ amount: 0 });
  }

  _calculateQuantityDiscount(amount: Dinero, item: Item) {
    if (item.condition && item.quantity > item.condition.quantity) {
      return amount.percentage(50);
    }

    return Money({ amount: 0 });
  }

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

      if (item.condition && item.condition.percentage) {
        discount = this._calculatePercentageDiscount(amount, item);
      }

      if (item.condition && item.condition.quantity) {
        discount = this._calculateQuantityDiscount(amount, item);
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
