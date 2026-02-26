import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SaleTransaction {
    customerType: CustomerType;
    transactionDate: bigint;
    totalAmountPees: bigint;
    products: Array<SaleItem>;
}
export interface Product {
    sku: string;
    retailPricePees: bigint;
    quantityInStock: bigint;
    name: string;
    description: string;
    wholesalePricePees: bigint;
    category: string;
}
export interface SaleItem {
    sku: string;
    quantity: bigint;
    priceInPees: bigint;
}
export enum CustomerType {
    retail = "retail",
    wholesale = "wholesale"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    deleteProduct(sku: string): Promise<void>;
    editProduct(sku: string, updatedProduct: Product): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getProduct(sku: string): Promise<Product>;
    getSales(): Promise<Array<SaleTransaction>>;
    recordSale(customerType: CustomerType, items: Array<SaleItem>): Promise<void>;
}
