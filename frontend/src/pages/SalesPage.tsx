import { useState } from 'react';
import { useGetSales } from '../hooks/useQueries';
import SaleForm from '../components/SaleForm';
import TransactionHistory from '../components/TransactionHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SalesPage() {
  const { data: sales = [], isLoading } = useGetSales();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground mt-1">
          Record new transactions and view sales history
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Sale</CardTitle>
            <CardDescription>
              Record a new wholesale or retail transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SaleForm onSuccess={handleSaleSuccess} />
          </CardContent>
        </Card>

        <TransactionHistory transactions={sales} key={refreshKey} />
      </div>
    </div>
  );
}
