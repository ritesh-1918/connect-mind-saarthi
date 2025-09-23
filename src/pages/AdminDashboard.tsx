import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Shield, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleAuth = () => {
    if (pin === '0000') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid PIN');
    }
  };

  // Mock data
  const stats = {
    totalUsers: 1247,
    activeAssessments: 89,
    pendingPosts: 12,
    bookingApprovals: 7,
    dailyActive: 156,
    weeklyGrowth: 12.5
  };

  const pendingPosts = [
    {
      id: 1,
      title: 'My journey with anxiety',
      excerpt: 'Sharing my experience with managing anxiety through meditation...',
      author: 'Anonymous User',
      category: 'anxiety',
      timestamp: '2 hours ago',
      riskLevel: 'low'
    },
    {
      id: 2,
      title: 'Finding hope after depression',
      excerpt: 'After months of struggle, I found strategies that helped...',
      author: 'Anonymous User',
      category: 'success',
      timestamp: '4 hours ago',
      riskLevel: 'medium'
    },
    {
      id: 3,
      title: 'Coping with work stress',
      excerpt: 'Work has been overwhelming lately and I need advice...',
      author: 'Anonymous User',
      category: 'selfcare',
      timestamp: '6 hours ago',
      riskLevel: 'high'
    }
  ];

  const bookingRequests = [
    {
      id: 1,
      userName: 'Anonymous User #1247',
      counselor: 'Dr. Sarah Smith',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Depression Counseling',
      status: 'pending'
    },
    {
      id: 2,
      userName: 'Anonymous User #1248',
      counselor: 'Dr. Raj Patel',
      date: '2024-01-15',
      time: '2:00 PM',
      type: 'Anxiety Support',
      status: 'pending'
    }
  ];

  const exportData = (type: string) => {
    const data = {
      type,
      exportDate: new Date().toISOString(),
      stats,
      pendingPosts: type === 'posts' ? pendingPosts : [],
      bookingRequests: type === 'bookings' ? bookingRequests : []
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `admin-${type}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter PIN</label>
              <Input
                type="password"
                placeholder="0000"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                className="min-h-[44px]"
              />
            </div>
            <Button 
              variant="wellness" 
              onClick={handleAuth} 
              className="w-full min-h-[44px]"
            >
              <Lock className="h-4 w-4 mr-2" />
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-heading font-bold text-gradient">
                Saarthi Admin Dashboard
              </h1>
            </div>
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'moderation', label: 'Post Moderation', icon: MessageSquare },
              { id: 'bookings', label: 'Booking Approvals', icon: Calendar },
              { id: 'exports', label: 'Data Export', icon: Download }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={activeTab === id ? 'wellness' : 'outline'}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 min-h-[44px]"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Assessments</p>
                      <p className="text-2xl font-bold">{stats.activeAssessments}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Posts</p>
                      <p className="text-2xl font-bold">{stats.pendingPosts}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking Approvals</p>
                      <p className="text-2xl font-bold">{stats.bookingApprovals}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Active</p>
                      <p className="text-2xl font-bold">{stats.dailyActive}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Weekly Growth</p>
                      <p className="text-2xl font-bold">+{stats.weeklyGrowth}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Post Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Community Post Moderation</h2>
              <Badge variant="warning">{pendingPosts.length} Pending</Badge>
            </div>

            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <Card key={post.id} className="glass border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{post.title}</h3>
                            <Badge variant={post.riskLevel === 'low' ? 'success' : post.riskLevel === 'medium' ? 'warning' : 'destructive'}>
                              {post.riskLevel === 'low' ? 'Low Risk' : post.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{post.author}</span>
                            <span>{post.category}</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="success" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Full
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Booking Approvals Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Counselor Booking Approvals</h2>
              <Badge variant="default">{bookingRequests.length} Pending</Badge>
            </div>

            <div className="space-y-4">
              {bookingRequests.map((booking) => (
                <Card key={booking.id} className="glass border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{booking.userName}</h3>
                              <p className="text-sm text-muted-foreground">{booking.type}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Counselor:</span>
                              <span className="ml-2 font-medium">{booking.counselor}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date:</span>
                              <span className="ml-2 font-medium">{booking.date}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Time:</span>
                              <span className="ml-2 font-medium">{booking.time}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant="warning" className="ml-2">Pending</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="success" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve Booking
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Decline
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Data Export Tab */}
        {activeTab === 'exports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Data Export & Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Export comprehensive user activity and engagement metrics.
                  </p>
                  <Button 
                    onClick={() => exportData('users')} 
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export User Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Assessment Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Download anonymized assessment results and trends.
                  </p>
                  <Button 
                    onClick={() => exportData('assessments')} 
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Assessments
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Community Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Export moderated community posts and engagement data.
                  </p>
                  <Button 
                    onClick={() => exportData('posts')} 
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Posts
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Booking Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Export counselor booking statistics and availability.
                  </p>
                  <Button 
                    onClick={() => exportData('bookings')} 
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Bookings
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Crisis Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Export high-risk assessments and crisis intervention logs.
                  </p>
                  <Button 
                    onClick={() => exportData('crisis')} 
                    variant="warning"
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Crisis Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Full Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Complete dashboard analytics and system metrics.
                  </p>
                  <Button 
                    onClick={() => exportData('complete')} 
                    variant="wellness"
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export All Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;