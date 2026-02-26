import { useGetAllProducts, useGetSales } from '../hooks/useQueries';
import MetricCard from '../components/MetricCard';
import RecentTransactions from '../components/RecentTransactions';
import LowStockAlerts from '../components/LowStockAlerts';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data: products = [], isLoading: productsLoading } = useGetAllProducts();
  const { data: sales = [], isLoading: salesLoading } = useGetSales();

  const metrics = useDashboardMetrics(products, sales);

  const isLoading = productsLoading || salesLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return `GH₵${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your business performance and inventory status
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Inventory Value"
          value={formatCurrency(metrics.totalInventoryValue)}
          description="Based on retail prices"
          icon={DollarSign}
          variant="default"
        />
        <MetricCard
          title="Total Products"
          value={products.length.toString()}
          description={`${metrics.lowStockCount} items low in stock`}
          icon={Package}
          variant={metrics.lowStockCount > 0 ? 'warning' : 'default'}
        />
        <MetricCard
          title="Wholesale Sales"
          value={formatCurrency(metrics.wholesaleSales)}
          description="Total wholesale revenue"
          icon={TrendingUp}
          variant="success"
        />
        <MetricCard
          title="Retail Sales"
          value={formatCurrency(metrics.retailSales)}
          description="Total retail revenue"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTransactions transactions={metrics.recentTransactions} />
        <LowStockAlerts products={metrics.lowStockProducts} />
      </div>
    </div>
  );
}
