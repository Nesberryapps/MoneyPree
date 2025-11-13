'use client';

import { useState, useEffect, useRef } from 'react';
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
  Loader2,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Trophy,
  Download,
  Calendar as CalendarIcon,
  Camera,
  ScanLine,
  Mic,
} from 'lucide-react';
import { BUDGET_CATEGORIES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { generateFinancialInsights, type FinancialInsight } from '@/ai/flows/generate-financial-insights';
import { parseReceipt } from '@/ai/flows/parse-receipt';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { PlaidLink } from '@/components/plaid/plaid-link';


type BudgetClientProps = {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    isVoiceInteractionEnabled: boolean;
    isPro: boolean;
};

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


export function BudgetClient({ transactions, setTransactions, isVoiceInteractionEnabled, isPro }: BudgetClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const [insights, setInsights] = useState<FinancialInsight | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();


  useEffect(() => {
    setIsClient(true);
  }, []);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { isListening: isListeningDescription, startListening: startListeningDescription, stopListening: stopListeningDescription } = useSpeechToText({ onTranscript: (text) => setDescription(prev => prev + text) });
  const { isListening: isListeningAmount, startListening: startListeningAmount, stopListening: stopListeningAmount } = useSpeechToText({ onTranscript: (text) => setAmount(prev => prev + text.replace(/[^0-9.]/g, '')) });


  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('');
    setDate(new Date());
    setEditingTransaction(null);
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setDescription(transaction.description);
      setAmount(String(transaction.amount));
      setType(transaction.type);
      setCategory(transaction.category);
      setDate(new Date(transaction.date));
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  }

  const handleSaveTransaction = () => {
    const transactionDate = date || new Date();
    if (editingTransaction) {
      // Edit existing transaction
      const updatedTransactions = transactions.map(t => 
        t.id === editingTransaction.id ? { ...t, description, amount: parseFloat(amount), type, category, date: transactionDate } : t
      );
      setTransactions(updatedTransactions);
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        id: `trans-${Date.now()}`,
        date: transactionDate,
        description,
        amount: parseFloat(amount),
        type,
        category,
      };
      setTransactions([newTransaction, ...transactions]);
    }
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setTransactionToDelete(null);
    setIsDeleteAlertOpen(false);
  }
  
  const openDeleteDialog = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteAlertOpen(true);
  }

  const handleGenerateInsights = async () => {
    setIsInsightsLoading(true);
    setInsightsError(null);
    setInsights(null);
    try {
      const result = await generateFinancialInsights({ transactions });
      setInsights(result);
    } catch (e) {
      setInsightsError('Failed to generate insights. Please try again.');
      console.error(e);
    } finally {
      setIsInsightsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!insights) return;

    const reportContent = `
# Your Financial Insights Report

## Surprising Insight
${insights.surprisingInsight}

## Spending Analysis
${insights.spendingAnalysis}

## Smart Nudges & Suggestions
${insights.suggestions.map(s => `- ${s}`).join('\n')}

## Your Next Monthly Challenge
${insights.monthlyChallenge}
    `;

    const blob = new Blob([reportContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Financial-Insights-Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  useEffect(() => {
    let stream: MediaStream;
    const startCamera = async () => {
      if (isScannerOpen) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      }
    };
    startCamera();

    return () => {
      // Cleanup: stop video stream when component unmounts or scanner closes
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScannerOpen, toast]);

  const handleCaptureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imageDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await parseReceipt({ receiptImage: imageDataUri });
      
      // Pre-fill the form with the scanned data
      setDescription(result.description || '');
      setAmount(String(result.amount || ''));
      setType('expense'); // Receipts are always expenses
      if (result.date) {
        // Attempt to parse various date formats
        const parsedDate = new Date(result.date);
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
        } else {
            // Fallback for dates that are not standard
            setDate(new Date()); 
            console.warn("Could not parse date:", result.date);
        }
      } else {
        setDate(new Date());
      }
      
      // Try to match the category
      const expenseCategories = BUDGET_CATEGORIES.expense.map(c => c.value);
      if (result.category && expenseCategories.includes(result.category)) {
        setCategory(result.category);
      } else {
        setCategory('other'); // Default category
      }

      setIsScannerOpen(false);
      setIsDialogOpen(true); // Open the transaction dialog for verification
      
      toast({
        title: 'Receipt Scanned!',
        description: 'Please verify the details and save the transaction.',
      });

    } catch (e) {
      console.error("Failed to scan receipt:", e);
      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: 'Could not extract details from the receipt. Please try again or enter manually.',
      });
    } finally {
      setIsScanning(false);
    }
  };


  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-3">
       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:col-span-3 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-green-500">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-red-500">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl md:text-3xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:col-span-2">
        <Card>
            <CardHeader className="px-7">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>A list of your recent income and expenses.</CardDescription>
            <div className="ml-auto flex items-center gap-2 pt-2">
                <div className="relative group">
                    <PlaidLink disabled={!isPro} />
                    {!isPro && (
                        <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
                            Pro
                        </Badge>
                    )}
                </div>

                <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                            <Camera className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Scan Receipt
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Scan Receipt</DialogTitle>
                        </DialogHeader>
                        <div className="relative">
                            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay playsInline muted />
                            {isScanning && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-md">
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                                <p className="text-white mt-2">Scanning...</p>
                            </div>
                            )}
                            <ScanLine className="absolute inset-0 m-auto h-full w-full text-white/20" />
                        </div>
                        
                        {hasCameraPermission === false && (
                           <Alert variant="destructive">
                              <AlertTitle>Camera Access Required</AlertTitle>
                              <AlertDescription>
                                To scan a receipt, please allow camera access in your browser settings and refresh the page.
                              </AlertDescription>
                           </Alert>
                        )}

                        <DialogFooter>
                            <Button onClick={handleCaptureAndScan} disabled={isScanning || hasCameraPermission === false}>
                            {isScanning ? 'Processing...' : 'Capture & Scan'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1" onClick={() => handleOpenDialog()}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Transaction
                    </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>{editingTransaction ? 'Edit' : 'Add'} Transaction</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <div className="relative">
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            {isVoiceInteractionEnabled && (
                                <Button
                                    size="icon"
                                    variant={isListeningDescription ? 'destructive' : 'ghost'}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7"
                                    onClick={isListeningDescription ? stopListeningDescription : startListeningDescription}
                                >
                                    <Mic className="h-4 w-4" />
                                </Button>
                            )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount</Label>
                                <div className="relative">
                                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                {isVoiceInteractionEnabled && (
                                    <Button
                                        size="icon"
                                        variant={isListeningAmount ? 'destructive' : 'ghost'}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7"
                                        onClick={isListeningAmount ? stopListeningAmount : startListeningAmount}
                                    >
                                        <Mic className="h-4 w-4" />
                                    </Button>
                                )}
                                </div>
                            </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                    <DialogFooter>
                    <Button onClick={handleSaveTransaction}>Save Transaction</Button>
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
                        {isClient ? formatDate(transaction.date) : ''}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                            <DropdownMenuItem onClick={() => handleOpenDialog(transaction)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(transaction.id)}>Delete</DropdownMenuItem>
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
      
      <canvas ref={canvasRef} className="hidden"></canvas>

      <div className="grid gap-4 lg:col-span-1">
        <Card>
            <CardHeader>
            <CardTitle>AI Financial Analyst</CardTitle>
            <CardDescription>
                Get a deep analysis of your spending, saving, and income habits.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Button onClick={handleGenerateInsights} disabled={isInsightsLoading}>
                {isInsightsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze My Finances
            </Button>
            </CardContent>
        </Card>

        {insightsError && (
            <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{insightsError}</p>
            </CardContent>
            </Card>
        )}

        {insights && (
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Your Insights Report</CardTitle>
                </div>
                <Button variant="outline" size="icon" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download Report</span>
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Sparkles className="text-primary"/> Surprising Insight</h3>
                <p className="text-muted-foreground">{insights.surprisingInsight}</p>
                </div>
                <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="text-primary"/> Spending Analysis</h3>
                <p className="text-muted-foreground">{insights.spendingAnalysis}</p>
                </div>
                <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-primary"/> Smart Nudges & Suggestions</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {insights.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                </ul>
                </div>
                <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Trophy className="text-primary"/> Your Next Monthly Challenge</h3>
                <p className="text-muted-foreground">{insights.monthlyChallenge}</p>
                </div>
            </CardContent>
            </Card>
        )}
      </div>

      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
                if (transactionToDelete) {
                    handleDeleteTransaction(transactionToDelete);
                }
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
