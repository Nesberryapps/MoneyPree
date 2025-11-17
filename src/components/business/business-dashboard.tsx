'use client';

import { useState, useMemo, useEffect } from 'react';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, FileText, PlusCircle, Loader2, MoreHorizontal, Lightbulb } from 'lucide-react';
import type { Business, BusinessTransaction } from '@/lib/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { formatDate } from '@/lib/utils';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { generatePLReport, type PLReport } from '@/ai/flows/generate-pl-report';
import { suggestTaxDeduction, type SuggestTaxDeductionOutput } from '@/ai/flows/suggest-tax-deduction';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDebounce } from 'use-debounce';
import { TaxCenter } from './tax-center';

const ENTITY_TYPES: Business['entityType'][] = [
  'Sole Proprietorship',
  'LLC',
  'S-Corp',
  'C-Corp',
  'Partnership',
];

const REVENUE_CATEGORIES = ['Sales', 'Services', 'Other'];
const EXPENSE_CATEGORIES = ['Marketing', 'Software', 'Travel', 'Office Supplies', 'Rent', 'Salaries', 'Other'];

function PLReportCard({ transactions }: { transactions: BusinessTransaction[] }) {
    const [report, setReport] = useState<PLReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setError(null);
        setReport(null);
        try {
            // Convert Firestore Timestamps to serializable date strings before sending to the server action
            const serializableTransactions = transactions.map(t => {
                const date = t.date instanceof Date ? t.date : (t.date as any).toDate();
                // We only select the fields that the AI flow needs to avoid passing complex objects like Timestamps
                return {
                    id: t.id,
                    businessId: t.businessId,
                    date: date.toISOString().split('T')[0], // YYYY-MM-DD
                    description: t.description,
                    amount: t.amount,
                    type: t.type,
                    category: t.category,
                }
            });

            const result = await generatePLReport({ transactions: serializableTransactions as any });
            setReport(result);
        } catch (e: any) {
            console.error(e);
            if (e.message && (e.message.includes('503') || e.message.toLowerCase().includes('overloaded'))) {
                setError('The AI service is currently busy. Please try again in a few moments.');
            } else {
                setError('Failed to generate report. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-sm font-medium">P&L Report</CardTitle>
                    <CardDescription className="text-xs">
                        AI-Generated Profit & Loss
                    </CardDescription>
                </div>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {!report && (
                     <Button onClick={handleGenerateReport} disabled={isLoading || transactions.length === 0} size="sm" variant="outline">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Report
                    </Button>
                )}
               
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}

                {report && (
                     <div className="space-y-4 text-sm mt-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold">{report.title}</h4>
                             <p className="text-xs text-muted-foreground">{report.period}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span>Total Revenue</span>
                            <span className="font-medium">${report.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Expenses</span>
                            <span className="font-medium">${report.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                            <span>Net Profit</span>
                            <span>${report.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                     </div>
                )}
            </CardContent>
             {report && (
                <CardFooter>
                     <Button onClick={handleGenerateReport} disabled={isLoading} size="sm" variant="secondary">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Regenerate
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}


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
            <PLReportCard transactions={transactions} />
        </div>
    )
}

function TransactionDialog({ open, onOpenChange, business, transaction, onSave }: { open: boolean, onOpenChange: (open: boolean) => void, business: Business, transaction: BusinessTransaction | null, onSave: () => void }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'revenue' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [isTaxDeductible, setIsTaxDeductible] = useState(false);
    
    const [debouncedDescription] = useDebounce(description, 500);
    const [aiSuggestion, setAiSuggestion] = useState<SuggestTaxDeductionOutput | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const firestore = useFirestore();
    const { user } = useUser();

    useEffect(() => {
        if (open) {
            if (transaction) {
                setDescription(transaction.description);
                setAmount(String(transaction.amount));
                setType(transaction.type);
                setCategory(transaction.category);
                const transactionDate = transaction.date instanceof Date ? transaction.date : (transaction.date as any).toDate();
                setDate(transactionDate.toISOString().split('T')[0]);
                setIsTaxDeductible(transaction.isTaxDeductible || false);
            } else {
                setDescription('');
                setAmount('');
                setType('expense');
                setCategory('');
                setDate(new Date().toISOString().split('T')[0]);
                setIsTaxDeductible(false);
            }
            setAiSuggestion(null); // Reset AI suggestion when dialog opens
        }
    }, [open, transaction]);
    
    useEffect(() => {
        const getAiSuggestion = async () => {
            if (type === 'expense' && debouncedDescription.length > 3 && category) {
                setIsAiLoading(true);
                setAiSuggestion(null);
                try {
                    const result = await suggestTaxDeduction({ description: debouncedDescription, category });
                    setAiSuggestion(result);
                    if (result.isDeductible) {
                        setIsTaxDeductible(true);
                    }
                } catch (e) {
                    console.error("AI suggestion failed:", e);
                } finally {
                    setIsAiLoading(false);
                }
            }
        };
        getAiSuggestion();
    }, [debouncedDescription, category, type]);


    const handleSave = async () => {
        if (!description || !amount || !category || !date || !user) return;
        
        const dataToSave = {
            description,
            amount: parseFloat(amount),
            type,
            category,
            date: new Date(date),
            isTaxDeductible: type === 'expense' ? isTaxDeductible : false,
        };

        if (transaction) {
            const transactionRef = doc(firestore, 'users', user.uid, 'businesses', business.id, 'transactions', transaction.id);
            await updateDoc(transactionRef, dataToSave);
        } else {
             const newTransactionData = {
                ...dataToSave,
                businessId: business.id,
                createdAt: serverTimestamp(),
            };
            const docRef = collection(firestore, 'users', user.uid, 'businesses', business.id, 'transactions');
            await addDoc(docRef, newTransactionData);
        }

        onSave();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{transaction ? 'Edit' : 'Add'} Business Transaction</DialogTitle>
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
                            <Select onValueChange={(v: 'revenue' | 'expense') => { setType(v); setCategory(''); }} value={type}>
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
                     {type === 'expense' && (
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox 
                                id="isTaxDeductible" 
                                checked={isTaxDeductible}
                                onCheckedChange={(checked) => setIsTaxDeductible(checked as boolean)}
                            />
                            <label
                                htmlFor="isTaxDeductible"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                This is a tax-deductible expense
                            </label>
                            {isAiLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                            {aiSuggestion?.isDeductible && !isAiLoading && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Badge variant="outline" className="ml-2 border-yellow-400 text-yellow-400 cursor-help">
                                                <Lightbulb className="h-3 w-3 mr-1" />
                                                AI Suggestion
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{aiSuggestion.reasoning}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    )}
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

  const [editingTransaction, setEditingTransaction] = useState<BusinessTransaction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const businessesRef = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'businesses');
  }, [firestore, user]);

  const { data: businesses, isLoading: isBusinessesLoading } = useCollection<Business>(businessesRef);
  const business = businesses?.[0];

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

  const handleOpenAddDialog = () => {
    setEditingTransaction(null);
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (txn: BusinessTransaction) => {
    setEditingTransaction(txn);
    setIsAddDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingTransaction(null);
  };

  const openDeleteDialog = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete || !user || !business) return;
    const transactionRef = doc(firestore, 'users', user.uid, 'businesses', business.id, 'transactions', transactionToDelete);
    await deleteDoc(transactionRef);
    setTransactionToDelete(null);
    setIsDeleteAlertOpen(false);
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

      <TaxCenter transactions={transactions || []} />

      <Card>
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                 <CardTitle>Business Transactions</CardTitle>
                 <CardDescription>
                    A list of your business's revenue and expenses.
                 </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1" onClick={handleOpenAddDialog}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Transaction
                    </span>
                </Button>
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
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isTransactionsLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                        </TableRow>
                    ) : transactions && transactions.length > 0 ? transactions.map(txn => (
                        <TableRow key={txn.id}>
                            <TableCell>{formatDate(txn.date)}</TableCell>
                             <TableCell className="font-medium">{txn.description}</TableCell>
                             <TableCell>
                                {txn.category}
                                {txn.isTaxDeductible && <Badge variant="outline" className="ml-2">Tax</Badge>}
                            </TableCell>
                             <TableCell>
                                <Badge variant={txn.type === 'revenue' ? 'default' : 'destructive'} className="text-xs">
                                    {txn.type}
                                </Badge>
                             </TableCell>
                             <TableCell className={`text-right font-medium ${txn.type === 'revenue' ? 'text-green-500' : 'text-red-500'}`}>
                                {txn.type === 'revenue' ? '+' : '-'}${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleOpenEditDialog(txn)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openDeleteDialog(txn.id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No transactions yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      <TransactionDialog
        open={isAddDialogOpen}
        onOpenChange={handleCloseDialog}
        business={business}
        transaction={editingTransaction}
        onSave={handleCloseDialog}
      />

        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this transaction.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTransaction}>
                Delete
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

    