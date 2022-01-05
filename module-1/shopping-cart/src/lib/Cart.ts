import find from 'lodash/find';
import remove from 'lodash/remove';
import Money, { Dinero } from 'dinero.js';

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

type Condition = {
  percentage: number;
  minimum: number;
  quantity?: number;
};

export interface Item {
  product: {
    title: string;
    price: number;
  };
  quantity: number;
  condition?: Condition | Condition[];
}

export interface ItemProps extends Omit<Item, 'product'> {
  condition?: Condition;
}

export default class Cart {
  items: Item[] = [];

  _calculatePercentageDiscount(amount: Dinero, item: ItemProps) {
    if (item.condition && item.quantity > item.condition.minimum) {
      return amount.percentage(item.condition.percentage);
    }

    return Money({ amount: 0 });
  }

  _calculateQuantityDiscount(amount: Dinero, item: ItemProps) {
    // debugger;
    const isEven = item.quantity % 2 === 0;

    if (item.condition && item.quantity > item.condition.quantity) {
      return amount.percentage(isEven ? 50 : 40);
    }

    return Money({ amount: 0 });
  }

  _calculateDiscount(
    amount: Dinero,
    quantity: number,
    condition: Condition | Condition[],
  ) {
    const list = Array.isArray(condition) ? condition : [condition];

    const [higherDiscount] = list
      .map(listCondition => {
        if (listCondition.percentage) {
          return this._calculatePercentageDiscount(amount, {
            condition: listCondition,
            quantity,
          }).getAmount();
        } else {
          return this._calculateQuantityDiscount(amount, {
            condition: listCondition,
            quantity,
          }).getAmount();
        }
      })
      .sort((a, b) => b - a);

    return Money({ amount: higherDiscount });
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

      if (item.condition) {
        discount = this._calculateDiscount(
          amount,
          item.quantity,
          item.condition,
        );
      }

      // if (item.condition && item.condition.percentage) {
      //   discount = this._calculatePercentageDiscount(amount, item);
      // }

      // if (item.condition && item.condition.quantity) {
      //   discount = this._calculateQuantityDiscount(amount, item);
      // }

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
