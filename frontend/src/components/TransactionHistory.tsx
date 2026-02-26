import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SaleTransaction } from '../backend';
import { format } from 'date-fns';
import { Filter } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: SaleTransaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'wholesale' | 'retail'>('all');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.customerType === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => Number(b.transactionDate) - Number(a.transactionDate)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All recorded sales</CardDescription>
          </div>
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="wholesale">Wholesale</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No transactions found.
          </p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {sortedTransactions.map((transaction, index) => {
                const date = new Date(Number(transaction.transactionDate) / 1000000);
                const totalAmount = (Number(transaction.totalAmountPees) / 100).toFixed(2);
                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-card space-y-2"
                  >
                    <div className="flex items-center justify-between">
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
                      <p className="text-lg font-bold">
                        GH₵{parseFloat(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.products.map((item, i) => {
                        const itemPrice = (Number(item.priceInPees) / 100).toFixed(2);
                        return (
                          <div key={i} className="flex justify-between">
                            <span>
                              {item.sku} × {Number(item.quantity)}
                            </span>
                            <span>GH₵{parseFloat(itemPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
