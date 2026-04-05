"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Info
} from 'lucide-react';

interface BlockchainTransaction {
  id: string;
  hash: string;
  type: 'donation' | 'resource_transfer' | 'payment' | 'escrow';
  fromAddress: string;
  toAddress: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  timestamp: string;
  blockNumber?: number;
  gasUsed?: number;
  metadata: {
    description?: string;
    category?: string;
    disasterId?: string;
    resourceId?: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
  };
}

interface SmartContract {
  id: string;
  name: string;
  type: 'donation' | 'resource' | 'escrow' | 'verification';
  address: string;
  status: 'active' | 'paused' | 'deprecated';
  totalTransactions: number;
  totalValue: number;
  createdAt: string;
  lastUpdated: string;
}

interface BlockchainServiceProps {
  userRole: 'government' | 'ngo' | 'public';
}

export default function BlockchainService({ userRole }: BlockchainServiceProps) {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newTransaction, setNewTransaction] = useState({
    type: 'donation',
    amount: '',
    currency: 'USD',
    description: '',
    category: '',
    disasterId: ''
  });

  useEffect(() => {
    const fetchBlockchainData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTransactions: BlockchainTransaction[] = [
        {
          id: '1',
          hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
          type: 'donation',
          fromAddress: '0x1234...5678',
          toAddress: '0xabcd...efgh',
          amount: 1000,
          currency: 'USD',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          blockNumber: 12345,
          gasUsed: 21000,
          metadata: {
            description: 'Emergency relief donation',
            category: 'medical',
            disasterId: 'disaster_001',
            verificationStatus: 'verified'
          }
        },
        {
          id: '2',
          hash: '0x2b3c4d5e6f7890ab1234567890abcdef1234567890abcdef1234567890abcdef',
          type: 'resource_transfer',
          fromAddress: '0xabcd...efgh',
          toAddress: '0xefgh...ijkl',
          amount: 500,
          currency: 'USD',
          status: 'confirmed',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          blockNumber: 12344,
          gasUsed: 45000,
          metadata: {
            description: 'Medical supplies transfer',
            category: 'supplies',
            resourceId: 'resource_001',
            verificationStatus: 'verified'
          }
        },
        {
          id: '3',
          hash: '0x3c4d5e6f7890ab1234567890abcdef1234567890abcdef1234567890abcdef12',
          type: 'escrow',
          fromAddress: '0xefgh...ijkl',
          toAddress: '0xijkl...mnop',
          amount: 2500,
          currency: 'USD',
          status: 'pending',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          metadata: {
            description: 'Emergency fund escrow',
            category: 'emergency',
            disasterId: 'disaster_002',
            verificationStatus: 'pending'
          }
        }
      ];

      const mockSmartContracts: SmartContract[] = [
        {
          id: '1',
          name: 'EmergencyDonationContract',
          type: 'donation',
          address: '0x1234...5678',
          status: 'active',
          totalTransactions: 156,
          totalValue: 125000,
          createdAt: '2024-01-01T00:00:00Z',
          lastUpdated: '2024-01-07T12:00:00Z'
        },
        {
          id: '2',
          name: 'ResourceTrackingContract',
          type: 'resource',
          address: '0xabcd...efgh',
          status: 'active',
          totalTransactions: 89,
          totalValue: 75000,
          createdAt: '2024-01-02T00:00:00Z',
          lastUpdated: '2024-01-07T11:30:00Z'
        },
        {
          id: '3',
          name: 'EscrowServiceContract',
          type: 'escrow',
          address: '0xefgh...ijkl',
          status: 'active',
          totalTransactions: 45,
          totalValue: 95000,
          createdAt: '2024-01-03T00:00:00Z',
          lastUpdated: '2024-01-07T10:00:00Z'
        }
      ];

      setTransactions(mockTransactions);
      setSmartContracts(mockSmartContracts);
      setLoading(false);
    };

    fetchBlockchainData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'deprecated': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
      case 'paused':
        return <Clock className="h-4 w-4" />;
      case 'failed':
      case 'cancelled':
      case 'deprecated':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'donation': return <DollarSign className="h-4 w-4" />;
      case 'resource_transfer': return <Truck className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'escrow': return <Lock className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCreateTransaction = async () => {
    // Simulate transaction creation
    const newTx: BlockchainTransaction = {
      id: Date.now().toString(),
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      type: newTransaction.type as any,
      fromAddress: '0xuser...address',
      toAddress: '0xcontract...address',
      amount: parseFloat(newTransaction.amount),
      currency: newTransaction.currency,
      status: 'pending',
      timestamp: new Date().toISOString(),
      metadata: {
        description: newTransaction.description,
        category: newTransaction.category,
        disasterId: newTransaction.disasterId || undefined,
        verificationStatus: 'pending'
      }
    };

    setTransactions([newTx, ...transactions]);
    setNewTransaction({
      type: 'donation',
      amount: '',
      currency: 'USD',
      description: '',
      category: '',
      disasterId: ''
    });
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'government':
        return [
          'Create and manage smart contracts',
          'Deploy emergency funds',
          'Verify transactions',
          'Audit blockchain records',
          'Manage escrow services',
          'Full transaction history access'
        ];
      case 'ngo':
        return [
          'Receive donations',
          'Request resource transfers',
          'Track fund utilization',
          'Verify delivery confirmations',
          'Limited contract access',
          'Transaction reporting'
        ];
      case 'public':
        return [
          'Make donations',
          'Track transaction status',
          'View public ledger',
          'Verify fund usage',
          'Basic transaction access',
          'Donation receipts'
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading blockchain data...</p>
        </div>
      </div>
    );
  }

  const totalValue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const confirmedTransactions = transactions.filter(tx => tx.status === 'confirmed').length;
  const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blockchain Service</h1>
          <p className="text-muted-foreground">
            Transparent relief fund and resource tracking with smart contracts
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="capitalize">
            {userRole}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Ledger
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +15% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {confirmedTransactions} confirmed, {pendingTransactions} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smartContracts.length}</div>
            <p className="text-xs text-muted-foreground">
              {smartContracts.filter(sc => sc.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((confirmedTransactions / transactions.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Transaction success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Permissions</CardTitle>
          <CardDescription>
            Available blockchain features based on your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {getRolePermissions(userRole).map((permission, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{permission}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Blockchain Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="create">Create Transaction</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest blockchain transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(tx.type)}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{formatCurrency(tx.amount)}</span>
                            <Badge variant="outline" className={getStatusColor(tx.status)}>
                              {tx.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatAddress(tx.fromAddress)} → {formatAddress(tx.toAddress)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </div>
                        {getStatusIcon(tx.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Smart Contracts Status */}
            <Card>
              <CardHeader>
                <CardTitle>Smart Contracts</CardTitle>
                <CardDescription>
                  Active smart contracts and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {smartContracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{contract.name}</span>
                          <Badge variant="outline" className={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatAddress(contract.address)} • {contract.totalTransactions} transactions
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(contract.totalValue)}</div>
                        <div className="text-sm text-muted-foreground">Total value</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blockchain Network Info */}
          <Card>
            <CardHeader>
              <CardTitle>Network Information</CardTitle>
              <CardDescription>
                Blockchain network status and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Mainnet</div>
                  <div className="text-sm text-muted-foreground">Network</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12,345</div>
                  <div className="text-sm text-muted-foreground">Latest Block</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">15 Gwei</div>
                  <div className="text-sm text-muted-foreground">Gas Price</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                Complete transaction history on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(tx.type)}
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{formatCurrency(tx.amount)}</span>
                          <Badge variant="outline" className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                          <Badge variant="outline">{tx.type}</Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>From: {formatAddress(tx.fromAddress)}</div>
                        <div>To: {formatAddress(tx.toAddress)}</div>
                        <div>Hash: {tx.hash}</div>
                        {tx.blockNumber && <div>Block: {tx.blockNumber}</div>}
                        {tx.metadata.description && (
                          <div>Description: {tx.metadata.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                      {tx.gasUsed && (
                        <div className="text-sm text-muted-foreground">
                          Gas: {tx.gasUsed}
                        </div>
                      )}
                      <div className="flex items-center space-x-1 mt-1">
                        {getStatusIcon(tx.status)}
                        <span className={`text-sm ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Contracts</CardTitle>
              <CardDescription>
                Deployed smart contracts and their functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smartContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{contract.name}</span>
                        <Badge variant="outline" className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                        <Badge variant="outline">{contract.type}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>Address: {contract.address}</div>
                        <div>Transactions: {contract.totalTransactions}</div>
                        <div>Total Value: {formatCurrency(contract.totalValue)}</div>
                        <div>Created: {new Date(contract.createdAt).toLocaleDateString()}</div>
                        <div>Last Updated: {new Date(contract.lastUpdated).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Transaction</CardTitle>
              <CardDescription>
                Create a new blockchain transaction for funds or resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Transaction Type</label>
                    <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({...newTransaction, type: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donation">Donation</SelectItem>
                        <SelectItem value="resource_transfer">Resource Transfer</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="escrow">Escrow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Currency</label>
                    <Select value={newTransaction.currency} onValueChange={(value) => setNewTransaction({...newTransaction, currency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="BTC">BTC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                      placeholder="Enter category"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    placeholder="Enter transaction description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Disaster ID (Optional)</label>
                  <Input
                    value={newTransaction.disasterId}
                    onChange={(e) => setNewTransaction({...newTransaction, disasterId: e.target.value})}
                    placeholder="Enter disaster ID"
                  />
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This transaction will be recorded on the blockchain and cannot be modified once confirmed.
                    Please ensure all details are correct before proceeding.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setNewTransaction({
                    type: 'donation',
                    amount: '',
                    currency: 'USD',
                    description: '',
                    category: '',
                    disasterId: ''
                  })}>
                    Clear
                  </Button>
                  <Button onClick={handleCreateTransaction}>
                    Create Transaction
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}