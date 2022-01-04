import find from 'lodash/find';
import remove from 'lodash/remove';

export interface Item {
  product: {
    title: string;
    price: number;
  };
  quantity: number;
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
    return this.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  }

  summary() {
    const total = this.getTotal();
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
