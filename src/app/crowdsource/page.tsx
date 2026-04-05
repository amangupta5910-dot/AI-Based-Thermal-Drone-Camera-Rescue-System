"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Video, 
  Upload, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Hash,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share,
  Filter,
  Search,
  Star,
  Users,
  Activity,
  Image as ImageIcon,
  Film,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Database,
  Cloud,
  Building,
  Package
} from 'lucide-react';

interface MediaUpdate {
  id: string;
  type: 'photo' | 'video';
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  category: 'damage' | 'rescue' | 'resources' | 'weather' | 'infrastructure' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  author: {
    id: string;
    name: string;
    reputation: number;
    verified: boolean;
  };
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected' | 'flagged';
  blockchainHash: string;
  verificationScore: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  thumbnail?: string;
  duration?: string;
  fileSize: string;
}

interface VerificationReport {
  id: string;
  mediaId: string;
  verifier: string;
  score: number;
  checks: {
    location: boolean;
    timestamp: boolean;
    authenticity: boolean;
    content: boolean;
  };
  comments: string;
  timestamp: string;
  blockchainHash: string;
}

interface ContributorStats {
  id: string;
  name: string;
  avatar?: string;
  contributions: number;
  verified: number;
  reputation: number;
  rank: number;
  badges: string[];
}

export default function CrowdsourcedMediaSystem() {
  const [mediaUpdates, setMediaUpdates] = useState<MediaUpdate[]>([]);
  const [verificationReports, setVerificationReports] = useState<VerificationReport[]>([]);
  const [topContributors, setTopContributors] = useState<ContributorStats[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<MediaUpdate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMediaData();
  }, []);

  const loadMediaData = async () => {
    // Simulate API call with mock data
    const mockMedia: MediaUpdate[] = [
      {
        id: '1',
        type: 'photo',
        title: 'Flood Damage in Downtown Area',
        description: 'Severe flooding affecting main commercial district',
        location: 'Downtown, City Center',
        coordinates: { lat: 37.7749, lng: -122.4194 },
        category: 'damage',
        severity: 'high',
        author: {
          id: 'user1',
          name: 'John Reporter',
          reputation: 850,
          verified: true
        },
        timestamp: '2024-01-15T10:30:00Z',
        status: 'verified',
        blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
        verificationScore: 92,
        views: 1234,
        likes: 89,
        comments: 23,
        shares: 12,
        fileSize: '2.4 MB'
      },
      {
        id: '2',
        type: 'video',
        title: 'Rescue Operation Progress',
        description: 'Emergency teams rescuing trapped residents',
        location: 'Residential District A',
        coordinates: { lat: 37.7849, lng: -122.4094 },
        category: 'rescue',
        severity: 'medium',
        author: {
          id: 'user2',
          name: 'Sarah Citizen',
          reputation: 720,
          verified: false
        },
        timestamp: '2024-01-15T09:15:00Z',
        status: 'verified',
        blockchainHash: '0x2b3c4d5e6f7890ab1234567890abcdef1234567890abcdef1234567890abcdef',
        verificationScore: 88,
        views: 2456,
        likes: 156,
        comments: 45,
        shares: 34,
        duration: '2:45',
        fileSize: '15.2 MB'
      },
      {
        id: '3',
        type: 'photo',
        title: 'Emergency Supplies Distribution',
        description: 'Food and water being distributed to affected families',
        location: 'Community Center',
        coordinates: { lat: 37.7649, lng: -122.4294 },
        category: 'resources',
        severity: 'low',
        author: {
          id: 'user3',
          name: 'Mike Volunteer',
          reputation: 920,
          verified: true
        },
        timestamp: '2024-01-15T08:45:00Z',
        status: 'pending',
        blockchainHash: '0x3c4d5e6f7890ab1234567890abcdef1234567890abcdef1234567890abcdef12',
        verificationScore: 0,
        views: 567,
        likes: 34,
        comments: 8,
        shares: 5,
        fileSize: '1.8 MB'
      }
    ];

    const mockReports: VerificationReport[] = [
      {
        id: '1',
        mediaId: '1',
        verifier: 'AI Verifier Alpha',
        score: 92,
        checks: {
          location: true,
          timestamp: true,
          authenticity: true,
          content: true
        },
        comments: 'Location verified via GPS data. Image analysis confirms authenticity.',
        timestamp: '2024-01-15T10:35:00Z',
        blockchainHash: '0x4d5e6f7890ab1234567890abcdef1234567890abcdef1234567890abcdef123'
      },
      {
        id: '2',
        mediaId: '2',
        verifier: 'AI Verifier Beta',
        score: 88,
        checks: {
          location: true,
          timestamp: true,
          authenticity: true,
          content: false
        },
        comments: 'Location and timestamp verified. Some content concerns detected.',
        timestamp: '2024-01-15T09:25:00Z',
        blockchainHash: '0x5e6f7890ab1234567890abcdef1234567890abcdef1234567890abcdef1234'
      }
    ];

    const mockContributors: ContributorStats[] = [
      {
        id: 'user1',
        name: 'John Reporter',
        contributions: 45,
        verified: 42,
        reputation: 850,
        rank: 1,
        badges: ['Top Contributor', 'Verified Source', 'Disaster Expert']
      },
      {
        id: 'user2',
        name: 'Sarah Citizen',
        contributions: 32,
        verified: 28,
        reputation: 720,
        rank: 2,
        badges: ['Active Reporter', 'Community Helper']
      },
      {
        id: 'user3',
        name: 'Mike Volunteer',
        contributions: 28,
        verified: 25,
        reputation: 920,
        rank: 3,
        badges: ['Verified Source', 'Relief Worker']
      }
    ];

    setMediaUpdates(mockMedia);
    setVerificationReports(mockReports);
    setTopContributors(mockContributors);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate processing and blockchain verification
    setTimeout(() => {
      loadMediaData();
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      case 'flagged':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'damage':
        return AlertCircle;
      case 'rescue':
        return Users;
      case 'resources':
        return Package;
      case 'weather':
        return Cloud;
      case 'infrastructure':
        return Building;
      default:
        return ImageIcon;
    }
  };

  const filteredMedia = mediaUpdates.filter(media => {
    const matchesCategory = selectedCategory === 'all' || media.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || media.status === selectedStatus;
    const matchesSearch = media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         media.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Camera className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Crowdsourced Media System</h1>
                <p className="text-sm text-muted-foreground">Blockchain-verified disaster updates from the community</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Blockchain Active
              </Badge>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload Disaster Update</DialogTitle>
                    <DialogDescription>
                      Share photos or videos of the disaster situation. All uploads are verified on the blockchain.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Media Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="damage">Damage Assessment</SelectItem>
                            <SelectItem value="rescue">Rescue Operations</SelectItem>
                            <SelectItem value="resources">Resource Distribution</SelectItem>
                            <SelectItem value="weather">Weather Conditions</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input placeholder="Brief description of the update" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Detailed Description</label>
                      <Textarea placeholder="Provide more details about what you're reporting..." rows={3} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input placeholder="Where was this taken?" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Severity</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Upload File</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          Supported formats: JPG, PNG, MP4, MOV (Max 100MB)
                        </p>
                        
                        {isUploading && (
                          <div className="mt-4">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              Uploading and verifying... {uploadProgress}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button disabled={isUploading}>
                        <Shield className="h-4 w-4 mr-2" />
                        Submit for Verification
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mediaUpdates.length}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-500">+24% today</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Verified Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mediaUpdates.filter(m => m.status === 'verified').length}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">Blockchain verified</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Active Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {topContributors.length}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Users className="h-3 w-3 text-purple-500" />
                <span className="text-xs text-purple-500">Community reporters</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Avg. Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mediaUpdates.filter(m => m.verificationScore > 0).length > 0 
                  ? Math.round(mediaUpdates.filter(m => m.verificationScore > 0).reduce((sum, m) => sum + m.verificationScore, 0) / mediaUpdates.filter(m => m.verificationScore > 0).length)
                  : 0}%
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Shield className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-500">Trust score</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Media Feed</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search updates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="damage">Damage</SelectItem>
                      <SelectItem value="rescue">Rescue</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                      <SelectItem value="weather">Weather</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Media Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((media) => {
                const CategoryIcon = getCategoryIcon(media.category);
                return (
                  <Card key={media.id} className="overflow-hidden">
                    <div className="relative">
                      {/* Media Thumbnail */}
                      <div className="h-48 bg-muted flex items-center justify-center">
                        {media.type === 'photo' ? (
                          <ImageIcon className="h-16 w-16 text-muted-foreground" />
                        ) : (
                          <Film className="h-16 w-16 text-muted-foreground" />
                        )}
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(media.status)}>
                          {media.status}
                        </Badge>
                      </div>
                      
                      {/* Type Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline">
                          {media.type === 'photo' ? <Camera className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                          {media.type}
                        </Badge>
                      </div>
                      
                      {/* Severity Badge */}
                      <div className="absolute bottom-2 left-2">
                        <Badge className={getSeverityColor(media.severity)}>
                          {media.severity}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-sm mb-1">{media.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {media.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{media.location}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{new Date(media.timestamp).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {media.author.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-xs font-medium">{media.author.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {media.author.reputation} rep
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {media.author.verified && (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            )}
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">{media.author.reputation}</span>
                          </div>
                        </div>
                        
                        {media.status === 'verified' && (
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1">
                              <Shield className="h-3 w-3 text-green-500" />
                              <span>Verified</span>
                              <span className="font-medium">{media.verificationScore}%</span>
                            </div>
                            <div className="text-muted-foreground">
                              {formatAddress(media.blockchainHash)}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{media.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{media.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{media.comments}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Database className="h-3 w-3" />
                            <span>{media.fileSize}</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setSelectedMedia(media)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Reports</CardTitle>
                <CardDescription>AI and blockchain verification results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationReports.map((report) => {
                    const media = mediaUpdates.find(m => m.id === report.mediaId);
                    return (
                      <div key={report.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Shield className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{media?.title || 'Unknown Media'}</div>
                              <div className="text-sm text-muted-foreground">
                                Verified by {report.verifier}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600">
                            {report.score}% Score
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div className="text-center">
                            <div className={`text-sm font-medium ${report.checks.location ? 'text-green-600' : 'text-red-600'}`}>
                              {report.checks.location ? '✓' : '✗'}
                            </div>
                            <div className="text-xs text-muted-foreground">Location</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-sm font-medium ${report.checks.timestamp ? 'text-green-600' : 'text-red-600'}`}>
                              {report.checks.timestamp ? '✓' : '✗'}
                            </div>
                            <div className="text-xs text-muted-foreground">Timestamp</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-sm font-medium ${report.checks.authenticity ? 'text-green-600' : 'text-red-600'}`}>
                              {report.checks.authenticity ? '✓' : '✗'}
                            </div>
                            <div className="text-xs text-muted-foreground">Authenticity</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-sm font-medium ${report.checks.content ? 'text-green-600' : 'text-red-600'}`}>
                              {report.checks.content ? '✓' : '✗'}
                            </div>
                            <div className="text-xs text-muted-foreground">Content</div>
                          </div>
                        </div>
                        
                        <div className="text-sm mb-3">
                          <div className="text-muted-foreground mb-1">Comments:</div>
                          <div>{report.comments}</div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div>
                            {new Date(report.timestamp).toLocaleString()}
                          </div>
                          <div className="font-mono">
                            {formatAddress(report.blockchainHash)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contributors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>Community members making a difference</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={contributor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <span className="text-sm font-bold">#{contributor.rank}</span>
                        </div>
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {contributor.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{contributor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {contributor.reputation} reputation points
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {contributor.contributions} contributions
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {contributor.verified} verified
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contributor.badges.slice(0, 2).map((badge, badgeIndex) => (
                            <Badge key={badgeIndex} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['damage', 'rescue', 'resources', 'weather', 'infrastructure', 'other'].map((category) => {
                      const count = mediaUpdates.filter(m => m.category === category).length;
                      const percentage = mediaUpdates.length > 0 ? (count / mediaUpdates.length) * 100 : 0;
                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="capitalize">{category}</span>
                            <span>{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['verified', 'pending', 'rejected', 'flagged'].map((status) => {
                      const count = mediaUpdates.filter(m => m.status === status).length;
                      const percentage = mediaUpdates.length > 0 ? (count / mediaUpdates.length) * 100 : 0;
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="capitalize">{status}</span>
                            <span>{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Community interaction with uploaded content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {mediaUpdates.reduce((sum, m) => sum + m.views, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {mediaUpdates.reduce((sum, m) => sum + m.likes, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Likes</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {mediaUpdates.reduce((sum, m) => sum + m.comments, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Comments</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {mediaUpdates.reduce((sum, m) => sum + m.shares, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Shares</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}