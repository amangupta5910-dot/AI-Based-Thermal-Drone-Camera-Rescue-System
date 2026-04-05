"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield,
  DollarSign,
  Truck,
  Package,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Hash,
  Link,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Database,
  Globe,
  Lock,
  Unlock,
  Key,
  CreditCard,
  Banknote,
  Box,
  Warehouse,
  AlertTriangle,
  Info,
  Building,
  Heart,
  User
} from 'lucide-react';
import BlockchainService from '@/components/blockchain/blockchain-service';

export default function BlockchainPage() {
  const [userRole, setUserRole] = useState<'government' | 'ngo' | 'public'>('government');

  const blockchainStats = {
    totalTransactions: 2847,
    totalValue: 2840000,
    activeContracts: 12,
    successRate: 96.8,
    pendingTransactions: 23,
    verifiedDonations: 1847
  };

  const getRoleFeatures = (role: string) => {
    switch (role) {
      case 'government':
        return [
          { icon: Shield, title: 'Smart Contract Management', description: 'Create and deploy emergency relief contracts' },
          { icon: DollarSign, title: 'Fund Allocation', description: 'Distribute emergency funds transparently' },
          { icon: Truck, title: 'Resource Tracking', description: 'Monitor resource movements on blockchain' },
          { icon: Users, title: 'Multi-Agency Coordination', description: 'Coordinate with NGOs and other agencies' },
          { icon: BarChart3, title: 'Advanced Analytics', description: 'Comprehensive blockchain analytics' },
          { icon: Key, title: 'Administrative Control', description: 'Full system administration access' }
        ];
      case 'ngo':
        return [
          { icon: Heart, title: 'Donation Management', description: 'Receive and track charitable donations' },
          { icon: Package, title: 'Resource Distribution', description: 'Distribute aid with blockchain verification' },
          { icon: Users, title: 'Volunteer Coordination', description: 'Manage volunteer efforts and contributions' },
          { icon: Truck, title: 'Logistics Tracking', description: 'Track supply chain and deliveries' },
          { icon: Eye, title: 'Transparency Reports', description: 'Generate transparent impact reports' },
          { icon: CheckCircle, title: 'Verification System', description: 'Verify delivery and service completion' }
        ];
      case 'public':
        return [
          { icon: DollarSign, title: 'Secure Donations', description: 'Make transparent, trackable donations' },
          { icon: Eye, title: 'Transaction Tracking', description: 'Follow your donations in real-time' },
          { icon: User, title: 'Personal Dashboard', description: 'Track your contribution impact' },
          { icon: CheckCircle, title: 'Verification Access', description: 'Verify fund usage and effectiveness' },
          { icon: Heart, title: 'Community Support', description: 'Support local relief efforts' },
          { icon: Download, title: 'Tax Receipts', description: 'Generate donation receipts for tax purposes' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Starfleet Blockchain</h1>
                <p className="text-sm text-muted-foreground">Transparent Relief Fund & Resource Tracking</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Role:</span>
                <Select value={userRole} onValueChange={(value) => setUserRole(value as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Whitepaper
              </Button>
              
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Blockchain Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Blockchain Overview</CardTitle>
                <CardDescription>
                  Key metrics and statistics for the disaster relief blockchain
                </CardDescription>
              </div>
              <Badge variant="outline" className="capitalize">
                {userRole} Access
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {blockchainStats.totalTransactions.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${blockchainStats.totalValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {blockchainStats.activeContracts}
                </div>
                <div className="text-sm text-muted-foreground">Active Contracts</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {blockchainStats.successRate}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {blockchainStats.pendingTransactions}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {blockchainStats.verifiedDonations.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Blockchain Features for {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</CardTitle>
            <CardDescription>
              Available blockchain features and capabilities based on your role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getRoleFeatures(userRole).map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Blockchain Service */}
        <BlockchainService userRole={userRole} />

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Blockchain Actions</CardTitle>
            <CardDescription>
              Common blockchain operations and tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userRole === 'government' && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Plus className="h-6 w-6" />
                    <span className="text-sm">Deploy Contract</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-sm">Allocate Funds</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Shield className="h-6 w-6" />
                    <span className="text-sm">Audit Ledger</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Key className="h-6 w-6" />
                    <span className="text-sm">Admin Panel</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Globe className="h-6 w-6" />
                    <span className="text-sm">Network Status</span>
                  </Button>
                </>
              )}
              
              {userRole === 'ngo' && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Heart className="h-6 w-6" />
                    <span className="text-sm">Receive Funds</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Truck className="h-6 w-6" />
                    <span className="text-sm">Request Resources</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Package className="h-6 w-6" />
                    <span className="text-sm">Track Supplies</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Manage Volunteers</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-sm">Verify Delivery</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Reports</span>
                  </Button>
                </>
              )}
              
              {userRole === 'public' && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-sm">Donate</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Eye className="h-6 w-6" />
                    <span className="text-sm">Track Donation</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <User className="h-6 w-6" />
                    <span className="text-sm">My Impact</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-sm">Verify Usage</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Heart className="h-6 w-6" />
                    <span className="text-sm">Support Local</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Receipt</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}