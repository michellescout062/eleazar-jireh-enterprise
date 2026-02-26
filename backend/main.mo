import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat64 "mo:core/Nat64";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Product = {
    name : Text;
    sku : Text;
    category : Text;
    wholesalePricePees : Nat;
    retailPricePees : Nat;
    quantityInStock : Nat;
    description : Text;
  };

  type SaleItem = {
    sku : Text;
    quantity : Nat;
    priceInPees : Nat;
  };

  type SaleTransaction = {
    customerType : CustomerType;
    products : [SaleItem];
    transactionDate : Nat64;
    totalAmountPees : Nat;
  };

  type CustomerType = {
    #wholesale;
    #retail;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.sku, p2.sku);
    };
  };

  let products = Map.empty<Text, Product>();
  let sales = Map.empty<Nat64, SaleTransaction>();

  // Product Management
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (products.containsKey(product.sku)) {
      Runtime.trap("Product with this SKU already exists");
    };
    products.add(product.sku, product);
  };

  public shared ({ caller }) func editProduct(sku : Text, updatedProduct : Product) : async () {
    if (products.containsKey(sku)) {
      products.add(sku, updatedProduct);
    } else {
      Runtime.trap("Product not found");
    };
  };

  public shared ({ caller }) func deleteProduct(sku : Text) : async () {
    if (products.containsKey(sku)) {
      products.remove(sku);
    } else {
      Runtime.trap("Product not found");
    };
  };

  public query ({ caller }) func getProduct(sku : Text) : async Product {
    switch (products.get(sku)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Sales Management
  public shared ({ caller }) func recordSale(customerType : CustomerType, items : [SaleItem]) : async () {
    let totalAmount = items.foldLeft(
      0,
      func(acc, item) { acc + (item.priceInPees * item.quantity) },
    );

    let transaction : SaleTransaction = {
      customerType;
      products = items;
      transactionDate = Nat64.fromIntWrap(Time.now());
      totalAmountPees = totalAmount;
    };

    sales.add(transaction.transactionDate, transaction);
  };

  public query ({ caller }) func getSales() : async [SaleTransaction] {
    sales.values().toArray();
  };
};
