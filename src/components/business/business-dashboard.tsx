
'use client';

import { useState } from 'react';
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
import { Briefcase, DollarSign, FileText } from 'lucide-react';
import type { Business } from '@/lib/types';
import { useUser } from '@/firebase';

const ENTITY_TYPES: Business['entityType'][] = [
  'Sole Proprietorship',
  'LLC',
  'S-Corp',
  'C-Corp',
  'Partnership',
];

function BusinessStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-xs text-muted-foreground">
                (Transaction tracking coming soon)
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-xs text-muted-foreground">
                 (Transaction tracking coming soon)
                </p>
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

export function BusinessDashboard() {
  const { user } = useUser();
  // In a real app, this would be fetched from Firestore
  const [business, setBusiness] = useState<Business | null>(null);

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [entityType, setEntityType] = useState<Business['entityType'] | ''>('');
  
  const handleCreateBusiness = () => {
    if (!name || !industry || !entityType || !user) return;
    
    const newBusiness: Business = {
      id: `biz-${Date.now()}`,
      userId: user.uid,
      name,
      industry,
      entityType,
    };
    
    // In a real app, we would save this to Firestore.
    // For now, we'll just set it in the local state.
    setBusiness(newBusiness);
    console.log('New Business Created:', newBusiness);
  };

  if (!business) {
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
                    <Button onClick={handleCreateBusiness} disabled={!name || !industry || !entityType}>Create Business</Button>
                </CardFooter>
            </Card>
        </div>
    );
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
      
      <BusinessStats />
    </div>
  );
}
