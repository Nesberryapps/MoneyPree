'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, FileText, PlusCircle, Loader2 } from 'lucide-react';
import type { Business, BusinessTransaction } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { formatDate } from '@/lib/utils';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';


const ENTITY_TYPES: Business['entityType'][] = [
  'Sole Proprietorship',
  'LLC',
  'S-Corp',
  'C-Corp',
  'Partnership',
];

const REVENUE_CATEGORIES = ['Sales', 'Services', 'Other'];
const EXPENSE_CATEGORIES = ['Marketing', 'Software', 'Travel', 'Office Supplies', 'Rent', 'Salaries', 'Other'];

function BusinessStats({ transactions }: { transactions: BusinessTransaction[] }) {
    const totalRevenue = transactions.filter(t => t.type === 'revenue').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-500">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">P&L Report</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Not Generated</div>
                <p className="text-xs text-muted-foreground">
                (Reporting features coming soon)
                </p>
            </CardContent>
            </Card>
        </div>
    )
}

function AddTransactionDialog({ businessId, onAddTransaction }: { businessId: string, onAddTransaction: (transaction: BusinessTransaction) => void }) {
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'revenue' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const firestore = useFirestore();
    const { user } = useUser();


    const handleSave = async () => {
        if (!description || !amount || !category || !date || !user) return;
        
        const newTransactionData = {
            businessId,
            description,
            amount: parseFloat(amount),
            type,
            category,
            date: new Date(date),
            createdAt: serverTimestamp(), // For ordering
        };

        const docRef = collection(firestore, 'users', user.uid, 'businesses', businessId, 'transactions');
        await addDoc(docRef, newTransactionData);

        setOpen(false);
        // Reset form
        setDescription('');
        setAmount('');
        setType('expense');
        setCategory('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <DialogTitle>Add Business Transaction</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="txn-desc">Description</Label>
                        <Input id="txn-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="txn-amount">Amount</Label>
                            <Input id="txn-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="txn-date">Date</Label>
                            <Input id="txn-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="txn-type">Type</Label>
                            <Select onValueChange={(v: 'revenue' | 'expense') => { setType(v); setCategory(''); }} defaultValue={type}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="revenue">Revenue</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="txn-category">Category</Label>
                             <Select onValueChange={setCategory} value={category}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(type === 'revenue' ? REVENUE_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save Transaction</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function CreateBusinessForm({ onCreate }: { onCreate: (business: Omit<Business, 'id' | 'userId'>) => void }) {
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [entityType, setEntityType] = useState<Business['entityType'] | ''>('');

    const handleCreate = () => {
        if (!name || !industry || !entityType) return;
        onCreate({ name, industry, entityType });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6" />
                    Set Up Your Business Profile
                </CardTitle>
                <CardDescription>
                    Let's get started by creating a profile for your business. This will help us tailor your financial tools.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input id="business-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane's Web Design" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g., Technology" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="entity-type">Entity Type</Label>
                        <Select onValueChange={(value: Business['entityType']) => setEntityType(value)}>
                            <SelectTrigger id="entity-type">
                                <SelectValue placeholder="Select a legal entity type" />
                            </SelectTrigger>
                            <SelectContent>
                                {ENTITY_TYPES.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCreate} disabled={!name || !industry || !entityType}>Create Business</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export function BusinessDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const businessesRef = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'businesses');
  }, [firestore, user]);

  const { data: businesses, isLoading: isBusinessesLoading } = useCollection<Business>(businessesRef);
  const business = businesses?.[0]; // For now, we assume only one business per user

  const transactionsQuery = useMemoFirebase(() => {
    if (!user || !business) return null;
    const transactionsRef = collection(firestore, 'users', user.uid, 'businesses', business.id, 'transactions');
    return query(transactionsRef, orderBy('date', 'desc'));
  }, [firestore, user, business]);

  const { data: transactions, isLoading: isTransactionsLoading } = useCollection<BusinessTransaction>(transactionsQuery);

  
  const handleCreateBusiness = async (businessData: Omit<Business, 'id' | 'userId'>) => {
    if (!user || !businessesRef) return;
    
    await addDoc(businessesRef, {
      ...businessData,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
  };

  if (isBusinessesLoading) {
      return (
          <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      )
  }

  if (!business) {
    return <CreateBusinessForm onCreate={handleCreateBusiness} />;
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            {business.name}
          </CardTitle>
          <CardDescription>
            {business.industry} | {business.entityType}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to your business command center. Manage your finances, track goals, and get AI-powered insights.
          </p>
        </CardContent>
      </Card>
      
      <BusinessStats transactions={transactions || []} />

      <Card>
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                 <CardTitle>Business Transactions</CardTitle>
                 <CardDescription>
                    A list of your business's revenue and expenses.
                 </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
               <AddTransactionDialog businessId={business.id} onAddTransaction={() => {}} />
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                 <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isTransactionsLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                        </TableRow>
                    ) : transactions && transactions.length > 0 ? transactions.map(txn => (
                        <TableRow key={txn.id}>
                            <TableCell>{formatDate(txn.date)}</TableCell>
                             <TableCell className="font-medium">{txn.description}</TableCell>
                             <TableCell>{txn.category}</TableCell>
                             <TableCell>
                                <Badge variant={txn.type === 'revenue' ? 'default' : 'destructive'} className="text-xs">
                                    {txn.type}
                                </Badge>
                             </TableCell>
                             <TableCell className={`text-right font-medium ${txn.type === 'revenue' ? 'text-green-500' : 'text-red-500'}`}>
                                {txn.type === 'revenue' ? '+' : '-'}${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No transactions yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

    </div>
  );
}

    