export class Product {
  public id: number;
  public name: string;
  public price: number;
  public description: string;

  constructor(id: number, name: string, price: number, description: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }

  static fromObject(data: Record<string, any>) {
    const { id, name, price, description } = data;

    return new Product(id, name, price, description);
  }

  static toObject(data: Product) {
    const { id, name, description, price } = data;

    return { id, name, price, description };
  }
}
