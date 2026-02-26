import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SaleTransaction } from '../backend';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  transactions: SaleTransaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest sales activity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions yet. Start recording sales to see them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest sales activity</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {transactions.map((transaction, index) => {
              const date = new Date(Number(transaction.transactionDate) / 1000000);
              const totalAmount = (Number(transaction.totalAmountPees) / 100).toFixed(2);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          transaction.customerType === 'wholesale'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {transaction.customerType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(date, 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.products.length} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      GH₵{parseFloat(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
