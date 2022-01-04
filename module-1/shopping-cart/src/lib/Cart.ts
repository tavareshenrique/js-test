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

  getTotal() {
    return this.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  }
}
