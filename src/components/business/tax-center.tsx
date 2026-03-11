'use client';

import { useMemo } from 'react';
import type { BusinessTransaction } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote } from 'lucide-react';

interface TaxCenterProps {
  transactions: BusinessTransaction[];
}

export function TaxCenter({ transactions }: TaxCenterProps) {
  const deductibleExpenses = useMemo(() => {
    return transactions.filter(t => t.type === 'expense' && t.isTaxDeductible);
  }, [transactions]);

  const totalDeductibleAmount = useMemo(() => {
    return deductibleExpenses.reduce((sum, t) => sum + t.amount, 0);
  }, [deductibleExpenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" />
          Tax Center
        </CardTitle>
        <CardDescription>
          A summary of your potential tax-deductible expenses for the current year.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">Total Deductible Expenses</p>
              <p className="text-3xl font-bold">
                ${totalDeductibleAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <Badge variant="premium">{deductibleExpenses.length} Items</Badge>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Deductible Expense Breakdown</h4>
            {deductibleExpenses.length > 0 ? (
              <div className="border rounded-md">
                {deductibleExpenses.map(txn => (
                  <div key={txn.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-xs text-muted-foreground">{txn.category}</p>
                    </div>
                    <p className="font-medium">
                      ${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tax-deductible expenses have been recorded yet.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
