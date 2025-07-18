import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Users, 
  Phone, 
  CheckCircle, 
  Plus, 
  Upload, 
  Activity, 
  BookOpen,
  Bot,
  Brain,
  MessageSquare,
  FileText
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// Mock data
const conversationTrends = [
  { date: '2024-01-01', conversations: 45 },
  { date: '2024-01-02', conversations: 52 },
  { date: '2024-01-03', conversations: 48 },
  { date: '2024-01-04', conversations: 61 },
  { date: '2024-01-05', conversations: 55 },
  { date: '2024-01-06', conversations: 67 },
  { date: '2024-01-07', conversations: 73 }
]

const languageData = [
  { language: 'English', percentage: 65, count: 1250 },
  { language: 'Spanish', percentage: 20, count: 385 },
  { language: 'French', percentage: 8, count: 154 },
  { language: 'German', percentage: 4, count: 77 },
  { language: 'Other', percentage: 3, count: 58 }
]

const COLORS = ['#9A66FF', '#3DDC97', '#F4B740', '#FF5C5C', '#60A5FA']

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  sparklineData?: number[]
  icon: React.ComponentType<{ className?: string }>
  dateRange: string
  onDateRangeChange: (range: string) => void
}

function MetricCard({ title, value, change, trend, sparklineData, icon: Icon, dateRange, onDateRangeChange }: MetricCardProps) {
  return (
    <Card className="surface-01 border-surface-stroke">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-med">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {sparklineData && (
            <div className="w-16 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData.map((value, index) => ({ value, index }))}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--brand-accent))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <Icon className="h-4 w-4 text-med" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-high">{value}</div>
            {change && (
              <p className={`text-xs ${
                trend === 'up' ? 'text-success' : 
                trend === 'down' ? 'text-error' : 
                'text-med'
              }`}>
                {change}
              </p>
            )}
          </div>
          <div className="flex space-x-1">
            {['Today', '7d', '30d'].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'ghost'}
                size="sm"
                className={`h-6 px-2 text-xs ${
                  dateRange === range 
                    ? 'bg-brand-accent hover:bg-brand-accent-hover text-white' 
                    : 'text-med hover:text-high'
                }`}
                onClick={() => onDateRangeChange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RingGauge({ percentage, size = 80 }: { percentage: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--surface-stroke))"
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--brand-accent))"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="motion-curve"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-high">{percentage}%</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [agentCount] = useState(0) // Set to 0 to show empty state
  const [dateRanges, setDateRanges] = useState({
    conversations: '7d',
    leads: '7d',
    calls: '7d',
    helpful: '7d'
  })
  const [trendsFilter, setTrendsFilter] = useState('7d')

  const updateDateRange = (metric: string, range: string) => {
    setDateRanges(prev => ({ ...prev, [metric]: range }))
  }

  const quickActions = [
    {
      title: 'Create Agent',
      description: 'Build a new AI agent',
      icon: Bot,
      action: () => console.log('Create Agent'),
      gradient: 'from-brand-accent/20 to-purple-500/20'
    },
    {
      title: 'Upload Knowledge',
      description: 'Add documents to knowledge base',
      icon: Upload,
      action: () => console.log('Upload Knowledge'),
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'View Recent Activity',
      description: 'Check latest conversations',
      icon: Activity,
      action: () => console.log('View Activity'),
      gradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      title: 'Open Docs',
      description: 'Access documentation',
      icon: BookOpen,
      action: () => console.log('Open Docs'),
      gradient: 'from-orange-500/20 to-yellow-500/20'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold text-high">
          Welcome back, Alex!
        </h1>
        <p className="text-med">
          Here's what's happening with your AI agents today.
        </p>
      </div>

      {/* Empty State Banner */}
      {agentCount === 0 && (
        <Card className="surface-01 border-surface-stroke bg-gradient-to-r from-brand-accent/5 via-transparent to-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-accent/30 to-purple-600/30 flex items-center justify-center p-2">
                <img 
                  src="/mio-ai-mascot.svg" 
                  alt="Mio AI" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-headline font-bold text-high mb-2">
                  Let's get you started with Mio AI!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <span className="text-sm text-med">Create Agent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-surface-stroke flex items-center justify-center">
                      <span className="text-med text-sm font-bold">2</span>
                    </div>
                    <span className="text-sm text-med">Add Knowledge Base</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-surface-stroke flex items-center justify-center">
                      <span className="text-med text-sm font-bold">3</span>
                    </div>
                    <span className="text-sm text-med">Test Chat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-surface-stroke flex items-center justify-center">
                      <span className="text-med text-sm font-bold">4</span>
                    </div>
                    <span className="text-sm text-med">Publish</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={agentCount === 0 ? 'opacity-25' : ''}>
          <MetricCard
            title="New Conversations"
            value="1,234"
            change="+12% from last period"
            trend="up"
            sparklineData={[45, 52, 48, 61, 55, 67, 73]}
            icon={MessageSquare}
            dateRange={dateRanges.conversations}
            onDateRangeChange={(range) => updateDateRange('conversations', range)}
          />
        </div>
        
        <div className={agentCount === 0 ? 'opacity-25' : ''}>
          <MetricCard
            title="Unique Leads"
            value="856"
            change="+8% from last period"
            trend="up"
            sparklineData={[32, 38, 35, 42, 39, 45, 48]}
            icon={Users}
            dateRange={dateRanges.leads}
            onDateRangeChange={(range) => updateDateRange('leads', range)}
          />
        </div>
        
        <div className={agentCount === 0 ? 'opacity-25' : ''}>
          <MetricCard
            title="Unique Calls Routed"
            value="423"
            change="+15% from last period"
            trend="up"
            sparklineData={[18, 22, 19, 26, 24, 28, 31]}
            icon={Phone}
            dateRange={dateRanges.calls}
            onDateRangeChange={(range) => updateDateRange('calls', range)}
          />
        </div>
        
        <div className={agentCount === 0 ? 'opacity-25' : ''}>
          <Card className="surface-01 border-surface-stroke">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-med">Helpful Answer %</CardTitle>
              <CheckCircle className="h-4 w-4 text-med" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <RingGauge percentage={87} />
                <div className="flex space-x-1">
                  {['Today', '7d', '30d'].map((range) => (
                    <Button
                      key={range}
                      variant={dateRanges.helpful === range ? 'default' : 'ghost'}
                      size="sm"
                      className={`h-6 px-2 text-xs ${
                        dateRanges.helpful === range 
                          ? 'bg-brand-accent hover:bg-brand-accent-hover text-white' 
                          : 'text-med hover:text-high'
                      }`}
                      onClick={() => updateDateRange('helpful', range)}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conversational Trends Chart */}
        <div className={agentCount === 0 ? 'opacity-25' : ''}>
          <Card className="surface-01 border-surface-stroke">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-high">Conversational Trends</CardTitle>
                <div className="flex space-x-1">
                  {['7d', '30d', '90d'].map((filter) => (
                    <Button
                      key={filter}
                      variant={trendsFilter === filter ? 'default' : 'ghost'}
                      size="sm"
                      className={`h-8 px-3 text-sm ${
                        trendsFilter === filter 
                          ? 'bg-brand-accent hover:bg-brand-accent-hover text-white' 
                          : 'text-med hover:text-high'
                      }`}
                      onClick={() => setTrendsFilter(filter)}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversationTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--surface-stroke))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--text-med))"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="hsl(var(--text-med))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--surface-01))',
                        border: '1px solid hsl(var(--surface-stroke))',
                        borderRadius: '8px',
                        color: 'hsl(var(--text-high))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversations" 
                      stroke="hsl(var(--brand-accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--brand-accent))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--brand-accent))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Languages Chart */}
        <div className={agentCount === 0 ? 'opacity-25' : ''}>
          <Card className="surface-01 border-surface-stroke">
            <CardHeader>
              <CardTitle className="text-high">Top Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {languageData.map((item, index) => (
                  <div key={item.language} className="flex items-center space-x-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-high">{item.language}</span>
                        <span className="text-sm text-med">{item.percentage}%</span>
                      </div>
                      <Progress 
                        value={item.percentage} 
                        className="h-2"
                        style={{ 
                          '--progress-background': COLORS[index] 
                        } as React.CSSProperties}
                      />
                    </div>
                    <span className="text-xs text-med w-12 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="surface-01 border-surface-stroke">
        <CardHeader>
          <CardTitle className="text-high">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={action.action}
                className={`p-4 rounded-lg border border-surface-stroke hover:border-brand-accent/50 motion-curve text-left bg-gradient-to-br ${action.gradient} hover:scale-105`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-surface-01 flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-high">{action.title}</h3>
                    <p className="text-xs text-med">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}