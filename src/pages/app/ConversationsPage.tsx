import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Download, 
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  TrendingUp,
  Filter,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'

interface Conversation {
  id: string
  leadName: string
  email: string
  phone: string
  lastActivity: string
  messagesCount: number
  helpfulPercentage: number
  status: 'active' | 'resolved' | 'escalated'
  messages: Message[]
}

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: string
  helpful?: boolean | null
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    leadName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    lastActivity: '2024-01-15T14:30:00Z',
    messagesCount: 12,
    helpfulPercentage: 85,
    status: 'active',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Hi, I need help with resetting my password.',
        timestamp: '2024-01-15T14:00:00Z'
      },
      {
        id: '2',
        type: 'bot',
        content: 'I\'d be happy to help you reset your password. To get started, please go to the login page and click on "Forgot Password". You\'ll receive an email with instructions to create a new password.',
        timestamp: '2024-01-15T14:01:00Z',
        helpful: true
      },
      {
        id: '3',
        type: 'user',
        content: 'I tried that but I\'m not receiving the email.',
        timestamp: '2024-01-15T14:05:00Z'
      },
      {
        id: '4',
        type: 'bot',
        content: 'Let me help you troubleshoot this. First, please check your spam/junk folder as the email might have been filtered there. Also, make sure you\'re using the correct email address associated with your account.',
        timestamp: '2024-01-15T14:06:00Z',
        helpful: true
      },
      {
        id: '5',
        type: 'user',
        content: 'Found it in spam! Thank you so much.',
        timestamp: '2024-01-15T14:10:00Z'
      },
      {
        id: '6',
        type: 'bot',
        content: 'Great! I\'m glad we could resolve that. To prevent future emails from going to spam, please add our email address to your contacts or safe sender list. Is there anything else I can help you with today?',
        timestamp: '2024-01-15T14:11:00Z',
        helpful: null
      }
    ]
  },
  {
    id: '2',
    leadName: 'Michael Chen',
    email: 'michael.chen@company.com',
    phone: '+1 (555) 987-6543',
    lastActivity: '2024-01-15T13:45:00Z',
    messagesCount: 8,
    helpfulPercentage: 92,
    status: 'resolved',
    messages: [
      {
        id: '7',
        type: 'user',
        content: 'What are your pricing plans?',
        timestamp: '2024-01-15T13:30:00Z'
      },
      {
        id: '8',
        type: 'bot',
        content: 'We offer three main pricing plans: Starter ($29/month), Professional ($79/month), and Enterprise ($199/month). Each plan includes different features and usage limits. Would you like me to explain the differences between them?',
        timestamp: '2024-01-15T13:31:00Z',
        helpful: true
      },
      {
        id: '9',
        type: 'user',
        content: 'Yes, please tell me about the Professional plan.',
        timestamp: '2024-01-15T13:35:00Z'
      },
      {
        id: '10',
        type: 'bot',
        content: 'The Professional plan at $79/month includes: unlimited projects, advanced analytics, priority support, API access, and up to 10 team members. It\'s perfect for growing businesses that need more advanced features.',
        timestamp: '2024-01-15T13:36:00Z',
        helpful: true
      }
    ]
  },
  {
    id: '3',
    leadName: 'Emma Davis',
    email: 'emma.davis@startup.io',
    phone: '+1 (555) 456-7890',
    lastActivity: '2024-01-15T12:20:00Z',
    messagesCount: 15,
    helpfulPercentage: 73,
    status: 'escalated',
    messages: [
      {
        id: '11',
        type: 'user',
        content: 'I\'m having trouble integrating your API with our system.',
        timestamp: '2024-01-15T12:00:00Z'
      },
      {
        id: '12',
        type: 'bot',
        content: 'I can help you with API integration. What specific issue are you encountering? Are you getting any error messages?',
        timestamp: '2024-01-15T12:01:00Z',
        helpful: false
      },
      {
        id: '13',
        type: 'user',
        content: 'I\'m getting a 401 authentication error.',
        timestamp: '2024-01-15T12:05:00Z'
      },
      {
        id: '14',
        type: 'bot',
        content: 'A 401 error typically means there\'s an authentication issue. Please make sure you\'re using the correct API key and that it\'s included in the Authorization header of your requests.',
        timestamp: '2024-01-15T12:06:00Z',
        helpful: true
      }
    ]
  }
]

export default function ConversationsPage() {
  const [conversations] = useState(mockConversations)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredConversations = conversations.filter(conv =>
    conv.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.phone.includes(searchQuery)
  )

  const handleViewConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setDrawerOpen(true)
  }

  const handleFeedback = (messageId: string, helpful: boolean) => {
    if (!selectedConversation) return
    
    const updatedMessages = selectedConversation.messages.map(msg =>
      msg.id === messageId ? { ...msg, helpful } : msg
    )
    
    setSelectedConversation({
      ...selectedConversation,
      messages: updatedMessages
    })
    
    toast.success(`Feedback recorded: ${helpful ? 'Helpful' : 'Not helpful'}`)
  }

  const exportConversation = () => {
    if (!selectedConversation) return
    
    const content = selectedConversation.messages
      .map(msg => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.type.toUpperCase()}: ${msg.content}`)
      .join('\n\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${selectedConversation.leadName.replace(/\s+/g, '-').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Conversation exported successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-brand-accent text-white'
      case 'resolved':
        return 'bg-success text-white'
      case 'escalated':
        return 'bg-warning text-white'
      default:
        return 'bg-surface-stroke text-med'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold text-high">
          Conversations
        </h1>
        <p className="text-med">
          Monitor and analyze conversations between your AI agents and leads. Review feedback and export conversation data.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="surface-01 border-surface-stroke">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-brand-accent/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-high">1,234</p>
                <p className="text-sm text-med">Total Conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="surface-01 border-surface-stroke">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-high">87%</p>
                <p className="text-sm text-med">Helpful Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="surface-01 border-surface-stroke">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-high">+12%</p>
                <p className="text-sm text-med">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="surface-01 border-surface-stroke">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-high">2.3m</p>
                <p className="text-sm text-med">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations Table */}
      <Card className="surface-01 border-surface-stroke">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-high">Recent Conversations</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-med" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 surface-01 border-surface-stroke text-high"
                  placeholder="Search conversations..."
                />
              </div>
              <Button variant="outline" className="border-surface-stroke text-med hover:text-high">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="border border-surface-stroke rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-surface-stroke hover:bg-surface-stroke/20">
                  <TableHead className="text-med">Lead Name</TableHead>
                  <TableHead className="text-med">Email</TableHead>
                  <TableHead className="text-med">Phone</TableHead>
                  <TableHead className="text-med">Last Activity</TableHead>
                  <TableHead className="text-med">Messages</TableHead>
                  <TableHead className="text-med">% Helpful</TableHead>
                  <TableHead className="text-med">Status</TableHead>
                  <TableHead className="text-med w-12">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.map((conversation, index) => (
                  <TableRow 
                    key={conversation.id} 
                    className={`border-surface-stroke hover:bg-surface-stroke/10 ${
                      index % 2 === 1 ? 'bg-surface-stroke/5' : ''
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent/30 to-purple-600/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-brand-accent" />
                        </div>
                        <span className="font-medium text-high">{conversation.leadName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-med" />
                        <span className="text-sm text-high">{conversation.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-med" />
                        <span className="text-sm text-high">{conversation.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-med" />
                        <span className="text-sm text-high">{formatTime(conversation.lastActivity)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-brand-accent/30 text-brand-accent">
                        {conversation.messagesCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-2 bg-surface-stroke rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full transition-all duration-300"
                            style={{ width: `${conversation.helpfulPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-high">{conversation.helpfulPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(conversation.status)}>
                        {conversation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewConversation(conversation)}
                        className="text-brand-accent hover:text-brand-accent-hover hover:bg-brand-accent/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[480px] surface-01 border-surface-stroke">
          {selectedConversation && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <SheetTitle className="text-high">{selectedConversation.leadName}</SheetTitle>
                    <SheetDescription className="text-med">
                      {selectedConversation.email}
                    </SheetDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedConversation.status)}>
                      {selectedConversation.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="surface-01 border-surface-stroke">
                        <DropdownMenuItem 
                          onClick={exportConversation}
                          className="text-high hover:bg-surface-stroke cursor-pointer"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download .txt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Conversation Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-high">{selectedConversation.messagesCount}</p>
                    <p className="text-xs text-med">Messages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-high">{selectedConversation.helpfulPercentage}%</p>
                    <p className="text-xs text-med">Helpful</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-high">{formatTime(selectedConversation.lastActivity)}</p>
                    <p className="text-xs text-med">Last Active</p>
                  </div>
                </div>
              </SheetHeader>
              
              <Separator className="bg-surface-stroke" />
              
              {/* Messages */}
              <ScrollArea className="flex-1 py-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-brand-accent text-white' 
                          : 'bg-surface-stroke text-high'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            message.type === 'user' ? 'text-white/70' : 'text-med'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                          
                          {message.type === 'bot' && (
                            <div className="flex items-center space-x-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 ${
                                  message.helpful === true 
                                    ? 'text-success hover:text-success' 
                                    : 'text-med hover:text-success'
                                }`}
                                onClick={() => handleFeedback(message.id, true)}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 ${
                                  message.helpful === false 
                                    ? 'text-error hover:text-error' 
                                    : 'text-med hover:text-error'
                                }`}
                                onClick={() => handleFeedback(message.id, false)}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}