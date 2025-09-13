'use client';

import { useState } from 'react';
import type { Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  PlusCircle,
  PiggyBank,
  Landmark,
  Car,
  Utensils,
  Sun,
  HeartPulse,
  ShoppingBag,
  HelpCircle,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { BUDGET_CATEGORIES } from '@/lib/constants';

const initialTransactions: Transaction[] = [
  { id: '1', date: new Date('2024-05-01'), description: 'Salary', amount: 5000, type: 'income', category: 'salary' },
  { id: '2', date: new Date('2024-05-01'), description: 'Rent', amount: 1500, type: 'expense', category: 'housing' },
  { id: '3', date: new Date('2024-05-05'), description: 'Groceries', amount: 300, type: 'expense', category: 'food' },
  { id: '4', date: new Date('2024-05-10'), description: 'Gas', amount: 50, type: 'expense', category: 'transportation' },
  { id: '5', date: new Date('2024-05-15'), description: 'Freelance Project', amount: 750, type: 'income', category: 'freelance' },
];

const CategoryIcon = ({ category }: { category: string }) => {
    const icons: { [key: string]: React.ElementType } = {
        salary: PiggyBank,
        freelance: Landmark,
        housing: Landmark,
        transportation: Car,
        food: Utensils,
        utilities: Sun,
        entertainment: Sun,
        health: HeartPulse,
        shopping: ShoppingBag,
        other: HelpCircle,
    };
    const Icon = icons[category] || HelpCircle;
    return <Icon className="h-4 w-4 text-muted-foreground" />;
};


export function BudgetClient() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: (transactions.length + 1).toString(),
      date: new Date(),
      description,
      amount: parseFloat(amount),
      type,
      category,
    };
    setTransactions([newTransaction, ...transactions]);
    setIsDialogOpen(false);
    // Reset form
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('');
  };
  
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>${netBalance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>A list of your recent income and expenses.</CardDescription>
          <div className="ml-auto flex items-center gap-2 pt-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Transaction
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select onValueChange={(v: any) => setType(v)} defaultValue={type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(v: any) => setCategory(v)} value={category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(type === 'income' ? BUDGET_CATEGORIES.income : BUDGET_CATEGORIES.expense).map(cat => (
                           <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddTransaction}>Save Transaction</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                     <Badge className="text-xs" variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                        {transaction.type}
                     </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={transaction.category} />
                      {transaction.category}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {transaction.date.toLocaleDateString()}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
