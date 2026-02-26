import { useMemo } from 'react';
import type { Product, SaleTransaction } from '../backend';

const LOW_STOCK_THRESHOLD = 10;

export function useDashboardMetrics(products: Product[], sales: SaleTransaction[]) {
  return useMemo(() => {
    const totalInventoryValue = products.reduce((total, product) => {
      return total + (Number(product.retailPricePees) / 100) * Number(product.quantityInStock);
    }, 0);

    const lowStockProducts = products.filter(
      (product) => Number(product.quantityInStock) < LOW_STOCK_THRESHOLD
    );

    const lowStockCount = lowStockProducts.length;

    const wholesaleSales = sales
      .filter((sale) => sale.customerType === 'wholesale')
      .reduce((total, sale) => total + Number(sale.totalAmountPees) / 100, 0);

    const retailSales = sales
      .filter((sale) => sale.customerType === 'retail')
      .reduce((total, sale) => total + Number(sale.totalAmountPees) / 100, 0);

    const recentTransactions = [...sales]
      .sort((a, b) => Number(b.transactionDate) - Number(a.transactionDate))
      .slice(0, 10);

    return {
      totalInventoryValue,
      lowStockProducts,
      lowStockCount,
      wholesaleSales,
      retailSales,
      recentTransactions,
    };
  }, [products, sales]);
}
