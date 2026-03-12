
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import { Briefcase, DollarSign, FileText, PlusCircle, Loader2, MoreHorizontal, Lightbulb, Camera, ScanLine, Mic, Sparkles, AlertTriangle, Download } from 'lucide-react';
import type { Business, BusinessTransaction } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { generatePLReportAction, suggestTaxDeductionAction, analyzePLReportAction, parseBusinessReceiptAction } from '@/app/actions/business-actions';
import type { PLReport } from '@/ai/flows/generate-pl-report';
import type { SuggestTaxDeductionOutput } from '@/ai/flows/suggest-tax-deduction';
import type { PLReportAnalysis } from '@/ai/flows/analyze-pl-report';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDebounce } from 'use-debounce';
import { TaxCenter } from './tax-center';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { REVENUE_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/constants';
import { useVoiceInteraction } from '@/hooks/use-voice-interaction';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { showFinancialAdvisorAds } from '@/services/admob';
import { useLocalData } from '@/hooks/use-local-data';


const ENTITY_TYPES: Business['entityType'][] = [
  'Sole Proprietorship',
  'LLC',
  'S-Corp',
  'C-Corp',
  'Partnership',
];

function PLReportCard({ transactions }: { transactions: BusinessTransaction[] }) {
    const [report, setReport] = useState<PLReport | null>(null);
    const [analysis, setAnalysis] = useState<PLReportAnalysis | null>(null);
    const [isReportLoading, setIsReportLoading] = useState(false);
    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const serializableTransactions = useMemo(() => {
        return transactions.map(t => {
            const date = t.date instanceof Date ? t.date : (t.date as any).toDate();
            return {
                id: t.id,
                businessId: t.businessId,
                date: date.toISOString().split('T')[0],
                description: t.description,
                amount: t.amount,
                type: t.type,
                category: t.category,
                isTaxDeductible: t.isTaxDeductible,
            }
        });
    }, [transactions]);


    const handleGenerateReport = async () => {
        showFinancialAdvisorAds(async () => {
            setIsReportLoading(true);
            setError(null);
            setReport(null);
            setAnalysis(null);
            try {
                const result = await generatePLReportAction({ transactions: serializableTransactions as any });
                setReport(result);
            } catch (e: any) {
                console.error(e);
                if (e.message && (e.message.includes('503') || e.message.toLowerCase().includes('overloaded'))) {
                    setError('The AI service is currently busy. Please try again in a few moments.');
                } else {
                    setError('Failed to generate report. Please try again.');
                }
            } finally {
                setIsReportLoading(false);
            }
        });
    };
    
    const handleAnalyzeReport = async () => {
        if (!report) return;
        showFinancialAdvisorAds(async () => {
            setIsAnalysisLoading(true);
            setError(null);
            setAnalysis(null);
            try {
                // Convert Timestamps to ISO strings before passing to the server action
                const plainTransactions = transactions.map(t => {
                    const date = t.date instanceof Date ? t.date : (t.date as any).toDate();
                    return {
                        ...t,
                        date: date.toISOString(),
                        createdAt: undefined, // Ensure non-serializable fields are removed
                    }
                });

                const result = await analyzePLReportAction({ plReport: report, transactions: plainTransactions as any });
                setAnalysis(result);
            } catch (e: any) {
                console.error(e);
                setError('Failed to analyze the report. Please try again.');
            } finally {
                setIsAnalysisLoading(false);
            }
        });
    };

    const handleDownload = () => {
        if (!report) return;
    
        let reportContent = `
# ${report.title}
Period: ${report.period}

## Summary
- Total Revenue: $${report.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Total Expenses: $${report.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- **Net Profit: $${report.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}**
        `;

        if (analysis) {
            reportContent += `

## CFO Analysis
### Performance Summary
${analysis.performanceSummary}

### Key Trends
${analysis.keyTrends.map(t => `- ${t}`).join('\n')}

### Actionable Advice
${analysis.actionableAdvice}
            `;
            if (analysis.riskAlert) {
                reportContent += `

### Risk Alert
${analysis.riskAlert}
                `;
            }
        }
    
        const blob = new Blob([reportContent.trim()], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Profit-and-Loss-Report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-sm font-medium">AI Business Analysis</CardTitle>
                    <CardDescription className="text-xs">
                        Generate a P&L and get insights.
                    </CardDescription>
                </div>
                {report ? (
                    <Button variant="ghost" size="icon" onClick={handleDownload} className="h-8 w-8 -mt-1 -mr-2">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download Report</span>
                    </Button>
                ) : (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                )}
            </CardHeader>
            <CardContent>
                {!report && (
                     <div className="relative group w-fit">
                        <Button onClick={handleGenerateReport} disabled={isReportLoading || transactions.length === 0} size="sm" variant="outline">
                            {isReportLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {isReportLoading ? 'Generating...' : 'Watch Ad & Generate'}
                        </Button>
                    </div>
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
                {analysis && (
                    <div className="mt-6 space-y-4">
                        <Separator />
                        <h4 className="font-semibold pt-2">CFO Analysis</h4>
                         <div className="space-y-1">
                            <h5 className="text-xs font-medium flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-primary" /> Performance Summary</h5>
                            <p className="text-xs text-muted-foreground">{analysis.performanceSummary}</p>
                         </div>
                         <div className="space-y-1">
                            <h5 className="text-xs font-medium flex items-center gap-1.5"><Lightbulb className="h-3 w-3 text-primary" /> Actionable Advice</h5>
                            <p className="text-xs text-muted-foreground">{analysis.actionableAdvice}</p>
                         </div>
                         {analysis.riskAlert && (
                             <Alert variant="destructive" className="p-3">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle className="text-xs font-semibold">Risk Alert</AlertTitle>
                                <AlertDescription className="text-xs">
                                    {analysis.riskAlert}
                                </AlertDescription>
                            </Alert>
                         )}
                    </div>
                )}
            </CardContent>
             {report && (
                <CardFooter className="gap-2">
                     <Button onClick={handleGenerateReport} disabled={isReportLoading} size="sm" variant="secondary">
                        {isReportLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Regenerate
                    </Button>
                    <Button onClick={handleAnalyzeReport} disabled={isAnalysisLoading} size="sm" variant="default">
                        {isAnalysisLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isAnalysisLoading ? 'Analyzing...' : 'Watch Ad & Analyze'}
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

function TransactionDialog({ open, onOpenChange, businessId, transaction, initialData, onSave }: { open: boolean, onOpenChange: (open: boolean) => void, businessId: string, transaction: BusinessTransaction | null, initialData?: Partial<BusinessTransaction>, onSave: (data: Partial<BusinessTransaction>) => void }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'revenue' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [isTaxDeductible, setIsTaxDeductible] = useState(false);
    
    const [debouncedDescription] = useDebounce(description, 500);
    const [aiSuggestion, setAiSuggestion] = useState<SuggestTaxDeductionOutput | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    const { isVoiceInteractionEnabled } = useVoiceInteraction();
    const { isListening: isListeningDescription, startListening: startListeningDescription, stopListening: stopListeningDescription } = useSpeechToText({ onTranscript: (text) => setDescription(prev => prev + text) });
    const { isListening: isListeningAmount, startListening: startListeningAmount, stopListening: stopListeningStopListeningDescription } = useSpeechToText({ onTranscript: (text) => setAmount(prev => prev + text.replace(/[^0-9.]/g, '')) });


    useEffect(() => {
        const data = transaction || initialData;
        if (data) {
            setDescription(data.description || '');
            setAmount(data.amount ? String(data.amount) : '');
            setType(data.type || 'expense');
            setCategory(data.category || '');
            const transactionDate = data.date ? (data.date instanceof Date ? data.date : (data.date as any).toDate()) : new Date();
            setDate(transactionDate.toISOString().split('T')[0]);
            setIsTaxDeductible(data.isTaxDeductible || false);
        } else {
            setDescription('');
            setAmount('');
            setType('expense');
            setCategory('');
            setDate(new Date().toISOString().split('T')[0]);
            setIsTaxDeductible(false);
        }
        setAiSuggestion(null); // Reset AI suggestion when dialog opens
    }, [transaction, initialData, open]);
    
    useEffect(() => {
        const getAiSuggestion = async () => {
            if (type === 'expense' && debouncedDescription.length > 3 && category) {
                showFinancialAdvisorAds(async () => {
                    setIsAiLoading(true);
                    setAiSuggestion(null);
                    try {
                        const result = await suggestTaxDeductionAction({ description: debouncedDescription, category });
                        setAiSuggestion(result);
                        if (result.isDeductible) {
                            setIsTaxDeductible(true);
                        }
                    } catch (e) {
                        console.error("AI suggestion failed:", e);
                    } finally {
                        setIsAiLoading(false);
                    }
                });
            }
        };
        getAiSuggestion();
    }, [debouncedDescription, category, type]);


    const handleSave = async () => {
        if (!description || !amount || !category || !date) return;
        
        const dataToSave = {
            description,
            amount: parseFloat(amount),
            type,
            category,
            date: new Date(date),
            isTaxDeductible: type === 'expense' ? isTaxDeductible : false,
        };

        onSave(dataToSave);
        onOpenChange(false);
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
                        <div className="relative">
                            <Input id="txn-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                            <Label htmlFor="txn-amount">Amount</Label>
                            <div className="relative">
                                <Input id="txn-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                {isVoiceInteractionEnabled && (
                                    <Button
                                        size="icon"
                                        variant={isListeningAmount ? 'destructive' : 'ghost'}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7"
                                        onClick={isListeningAmount ? stopListeningStopListeningDescription : stopListeningStopListeningDescription}
                                    >
                                        <Mic className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
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

export function BusinessDashboard() {
  const { businessTransactions: transactions, setBusinessTransactions: setTransactions } = useLocalData();
  const { toast } = useToast();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<BusinessTransaction | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<Partial<BusinessTransaction> | null>(null);
  
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use a static ID for the single, implicit business context
  const businessId = 'main_business';

  const handleOpenDialog = (txn?: BusinessTransaction) => {
    if (txn) {
        setEditingTransaction(txn);
    } else {
        setEditingTransaction(null);
    }
    setScannedData(null);
    setIsDialogVisible(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogVisible(false);
    setEditingTransaction(null);
    setScannedData(null);
  };

  const openDeleteDialog = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    setTransactions(transactions.filter(t => t.id !== transactionToDelete));
    setTransactionToDelete(null);
    setIsDeleteAlertOpen(false);
  };
  
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
    };
    
    if (isScannerOpen) {
        getCameraPermission();
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isScannerOpen, toast]);


  const handleCaptureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    showFinancialAdvisorAds(async () => {
        setIsScanning(true);

        const video = videoRef.current!;
        const canvas = canvasRef.current!;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            setIsScanning(false);
            return;
        }

        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUri = canvas.toDataURL('image/jpeg');

        try {
        const result = await parseBusinessReceiptAction({ receiptImage: imageDataUri, isBusiness: true });
        
        const parsedData: Partial<BusinessTransaction> = {
            description: result.description || '',
            amount: result.amount || undefined,
            type: 'expense',
        };
        
        if (result.date) {
            const parsedDate = new Date(result.date);
            if (!isNaN(parsedDate.getTime())) {
            parsedData.date = parsedDate;
            } else {
                parsedData.date = new Date(); 
            }
        } else {
            parsedData.date = new Date();
        }
        
        if (result.category && EXPENSE_CATEGORIES.includes(result.category)) {
            parsedData.category = result.category;
        } else {
            parsedData.category = 'Other';
        }

        setScannedData(parsedData);
        setIsScannerOpen(false);
        setIsDialogVisible(true);
        
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
    });
  };

  const handleSaveTransaction = (data: Partial<BusinessTransaction>) => {
    if (editingTransaction) {
        const updatedTxn = { ...editingTransaction, ...data };
        setTransactions(transactions.map(t => t.id === editingTransaction.id ? updatedTxn : t));
    } else {
        const newTransaction: BusinessTransaction = {
            id: Date.now().toString(),
            businessId: businessId,
            date: data.date || new Date(),
            description: data.description || '',
            amount: data.amount || 0,
            type: data.type || 'expense',
            category: data.category || 'Other',
            isTaxDeductible: data.isTaxDeductible || false,
            createdAt: new Date(),
        };
        setTransactions([...transactions, newTransaction]);
    }
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            My Business
          </CardTitle>
          <CardDescription>
            Welcome to your business command center. Manage your finances, track goals, and get AI-powered insights.
          </CardDescription>
        </CardHeader>
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
                            <DialogTitle>Scan Business Receipt</DialogTitle>
                        </DialogHeader>
                        <div className="relative">
                            <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay playsInline muted />
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
                            <Button onClick={handleCaptureAndScan} disabled={isScanning || !hasCameraPermission}>
                            {isScanning ? 'Processing...' : 'Watch Ad & Scan'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button size="sm" className="h-8 gap-1" onClick={() => handleOpenDialog()}>
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
                    {transactions && transactions.length > 0 ? [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime()).map(txn => (
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
                                        <DropdownMenuItem onClick={() => handleOpenDialog(txn)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openDeleteDialog(txn.id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>                        </TableRow>
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
      
      <canvas ref={canvasRef} className="hidden"></canvas>

      <TransactionDialog
        open={isDialogVisible}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                handleCloseDialog();
            } else {
                setIsDialogVisible(true);
            }
        }}
        businessId={businessId}
        transaction={editingTransaction}
        initialData={scannedData || undefined}
        onSave={handleSaveTransaction}
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
