import Map "mo:core/Map";
import Nat64 "mo:core/Nat64";

module {
  type OldProduct = {
    name : Text;
    sku : Text;
    category : Text;
    wholesalePrice : Nat;
    retailPrice : Nat;
    quantityInStock : Nat;
    description : Text;
  };

  type OldSaleItem = {
    sku : Text;
    quantity : Nat;
    price : Nat;
  };

  type OldSaleTransaction = {
    customerType : OldCustomerType;
    products : [OldSaleItem];
    transactionDate : Nat64;
    totalAmount : Nat;
  };

  type OldCustomerType = {
    #wholesale;
    #retail;
  };

  type OldActor = {
    products : Map.Map<Text, OldProduct>;
    sales : Map.Map<Nat64, OldSaleTransaction>;
  };

  type NewProduct = {
    name : Text;
    sku : Text;
    category : Text;
    wholesalePricePees : Nat;
    retailPricePees : Nat;
    quantityInStock : Nat;
    description : Text;
  };

  type NewSaleItem = {
    sku : Text;
    quantity : Nat;
    priceInPees : Nat;
  };

  type NewSaleTransaction = {
    customerType : NewCustomerType;
    products : [NewSaleItem];
    transactionDate : Nat64;
    totalAmountPees : Nat;
  };

  type NewCustomerType = {
    #wholesale;
    #retail;
  };

  type NewActor = {
    products : Map.Map<Text, NewProduct>;
    sales : Map.Map<Nat64, NewSaleTransaction>;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Text, OldProduct, NewProduct>(
      func(_sku, oldProduct) {
        {
          oldProduct with
          wholesalePricePees = oldProduct.wholesalePrice;
          retailPricePees = oldProduct.retailPrice;
        };
      }
    );

    let newSales = old.sales.map<Nat64, OldSaleTransaction, NewSaleTransaction>(
      func(_date, oldTransaction) {
        {
          oldTransaction with
          products = oldTransaction.products.map(
            func(oldItem) {
              {
                oldItem with
                priceInPees = oldItem.price;
              };
            }
          );
          totalAmountPees = oldTransaction.totalAmount;
        };
      }
    );

    {
      products = newProducts;
      sales = newSales;
    };
  };
};
