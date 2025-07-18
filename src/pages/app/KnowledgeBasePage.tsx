import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Link,
  FileText,
  MessageSquare,
  Calendar,
  User,
  Globe,
  File,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

interface KnowledgeItem {
  id: string
  title: string
  type: 'link' | 'document' | 'qa'
  status: 'active' | 'processing' | 'error'
  lastUpdated: string
  author: string
  size?: string
  url?: string
  question?: string
  answer?: string
}

const mockData: KnowledgeItem[] = [
  {
    id: '1',
    title: 'Product Documentation',
    type: 'link',
    status: 'active',
    lastUpdated: '2024-01-15',
    author: 'Alex Johnson',
    url: 'https://docs.company.com/products'
  },
  {
    id: '2',
    title: 'User Manual v2.1',
    type: 'document',
    status: 'active',
    lastUpdated: '2024-01-14',
    author: 'Sarah Chen',
    size: '2.4 MB'
  },
  {
    id: '3',
    title: 'How to reset password?',
    type: 'qa',
    status: 'active',
    lastUpdated: '2024-01-13',
    author: 'Mike Wilson',
    question: 'How to reset password?',
    answer: 'To reset your password, go to the login page and click "Forgot Password"...'
  },
  {
    id: '4',
    title: 'API Reference Guide',
    type: 'document',
    status: 'processing',
    lastUpdated: '2024-01-12',
    author: 'David Kim',
    size: '1.8 MB'
  },
  {
    id: '5',
    title: 'FAQ Section',
    type: 'link',
    status: 'error',
    lastUpdated: '2024-01-11',
    author: 'Emma Davis',
    url: 'https://help.company.com/faq'
  }
]

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState('links')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('lastUpdated')
  const [filterStatus, setFilterStatus] = useState('all')
  const [data, setData] = useState(mockData)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    type: 'link' as 'link' | 'document' | 'qa',
    title: '',
    url: '',
    question: '',
    answer: '',
    file: null as File | null
  })

  const filteredData = data
    .filter(item => {
      if (activeTab === 'links' && item.type !== 'link') return false
      if (activeTab === 'documents' && item.type !== 'document') return false
      if (activeTab === 'qa' && item.type !== 'qa') return false
      if (filterStatus !== 'all' && item.status !== filterStatus) return false
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'author') return a.author.localeCompare(b.author)
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'processing':
        return <Clock className="w-4 h-4 text-warning" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-error" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'link':
        return <Link className="w-4 h-4 text-brand-accent" />
      case 'document':
        return <FileText className="w-4 h-4 text-blue-400" />
      case 'qa':
        return <MessageSquare className="w-4 h-4 text-green-400" />
      default:
        return null
    }
  }

  const handleAddItem = () => {
    const item: KnowledgeItem = {
      id: Date.now().toString(),
      title: newItem.title,
      type: newItem.type,
      status: 'processing',
      lastUpdated: new Date().toISOString().split('T')[0],
      author: 'Alex Johnson',
      ...(newItem.type === 'link' && { url: newItem.url }),
      ...(newItem.type === 'document' && { size: '1.2 MB' }),
      ...(newItem.type === 'qa' && { question: newItem.question, answer: newItem.answer })
    }

    setData(prev => [item, ...prev])
    setAddDialogOpen(false)
    setNewItem({
      type: 'link',
      title: '',
      url: '',
      question: '',
      answer: '',
      file: null
    })
    
    toast.success(`${newItem.type === 'qa' ? 'Q&A' : newItem.type.charAt(0).toUpperCase() + newItem.type.slice(1)} added successfully!`)
    
    // Simulate processing completion
    setTimeout(() => {
      setData(prev => prev.map(i => i.id === item.id ? { ...i, status: 'active' } : i))
    }, 2000)
  }

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id))
    toast.success('Item deleted successfully!')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-powerpoint', 'text/html']
      if (!allowedTypes.includes(file.type)) {
        toast.error('File type not supported. Please upload PDF, DOCX, TXT, PPT, or HTML files.')
        return
      }
      
      // Check file size (30MB limit)
      if (file.size > 30 * 1024 * 1024) {
        toast.error('File size must be less than 30MB.')
        return
      }
      
      setNewItem(prev => ({ ...prev, file, title: file.name }))
      toast.success('File uploaded successfully!')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold text-high">
          Knowledge Base
        </h1>
        <p className="text-med">
          Manage your AI agent's knowledge sources. Upload documents, add links, and create Q&A pairs to enhance your agent's capabilities.
        </p>
      </div>

      {/* Main Content */}
      <Card className="surface-01 border-surface-stroke">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-high">AI Brain</CardTitle>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-accent hover:bg-brand-accent-hover text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Knowledge
                </Button>
              </DialogTrigger>
              <DialogContent className="surface-01 border-surface-stroke max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-high">Add Knowledge Source</DialogTitle>
                  <DialogDescription className="text-med">
                    Add a new knowledge source to enhance your AI agent's capabilities.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-high font-medium">Type</Label>
                    <Select value={newItem.type} onValueChange={(value: 'link' | 'document' | 'qa') => setNewItem(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="surface-01 border-surface-stroke text-high">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="surface-01 border-surface-stroke">
                        <SelectItem value="link">Website Link</SelectItem>
                        <SelectItem value="document">Document Upload</SelectItem>
                        <SelectItem value="qa">Q&A Pair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newItem.type === 'link' && (
                    <>
                      <div className="space-y-3">
                        <Label htmlFor="title" className="text-high font-medium">Title</Label>
                        <Input
                          id="title"
                          value={newItem.title}
                          onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high"
                          placeholder="Enter a descriptive title"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="url" className="text-high font-medium">URL</Label>
                        <Input
                          id="url"
                          value={newItem.url}
                          onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high"
                          placeholder="https://example.com"
                        />
                      </div>
                    </>
                  )}

                  {newItem.type === 'document' && (
                    <>
                      <div className="space-y-3">
                        <Label className="text-high font-medium">File Upload</Label>
                        <div className="border-2 border-dashed border-surface-stroke rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept=".pdf,.docx,.txt,.ppt,.html"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 text-brand-accent mx-auto" />
                              <div>
                                <p className="text-high font-medium">Click to upload file</p>
                                <p className="text-sm text-med">PDF, DOCX, TXT, PPT, HTML (max 30MB)</p>
                              </div>
                            </div>
                          </Label>
                          {newItem.file && (
                            <div className="mt-4 p-3 bg-brand-accent/10 rounded-lg">
                              <p className="text-brand-accent font-medium">{newItem.file.name}</p>
                              <p className="text-sm text-med">{(newItem.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-4 bg-surface-stroke/20 rounded-lg">
                        <div className="text-center">
                          <File className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          <p className="text-xs text-med">PDF</p>
                        </div>
                        <div className="text-center">
                          <File className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-xs text-med">DOCX</p>
                        </div>
                        <div className="text-center">
                          <File className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <p className="text-xs text-med">TXT</p>
                        </div>
                      </div>
                      <div className="text-center opacity-40">
                        <File className="w-8 h-8 text-med mx-auto mb-2" />
                        <p className="text-xs text-med">CSV - Coming Soon</p>
                      </div>
                    </>
                  )}

                  {newItem.type === 'qa' && (
                    <>
                      <div className="space-y-3">
                        <Label htmlFor="question" className="text-high font-medium">Question</Label>
                        <Input
                          id="question"
                          value={newItem.question}
                          onChange={(e) => setNewItem(prev => ({ ...prev, question: e.target.value, title: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high"
                          placeholder="What question should this answer?"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="answer" className="text-high font-medium">Answer</Label>
                        <Textarea
                          id="answer"
                          value={newItem.answer}
                          onChange={(e) => setNewItem(prev => ({ ...prev, answer: e.target.value }))}
                          rows={4}
                          className="surface-01 border-surface-stroke text-high"
                          placeholder="Provide a comprehensive answer..."
                        />
                      </div>
                    </>
                  )}
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setAddDialogOpen(false)}
                    className="border-surface-stroke text-med hover:text-high"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddItem}
                    disabled={!newItem.title || (newItem.type === 'link' && !newItem.url) || (newItem.type === 'qa' && (!newItem.question || !newItem.answer)) || (newItem.type === 'document' && !newItem.file)}
                    className="bg-brand-accent hover:bg-brand-accent-hover text-white"
                  >
                    Add Knowledge
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="links" className="flex items-center space-x-2">
                <Link className="w-4 h-4" />
                <span>Links</span>
                <Badge variant="secondary" className="ml-2">
                  {data.filter(item => item.type === 'link').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Documents</span>
                <Badge variant="secondary" className="ml-2">
                  {data.filter(item => item.type === 'document').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="qa" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Q&A</span>
                <Badge variant="secondary" className="ml-2">
                  {data.filter(item => item.type === 'qa').length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 space-x-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-med" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 surface-01 border-surface-stroke text-high"
                    placeholder="Search knowledge base..."
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 surface-01 border-surface-stroke text-high">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="surface-01 border-surface-stroke">
                    <SelectItem value="lastUpdated">Last Updated</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32 surface-01 border-surface-stroke text-high">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="surface-01 border-surface-stroke">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content for all tabs */}
            <TabsContent value={activeTab} className="mt-0">
              <div className="border border-surface-stroke rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-surface-stroke hover:bg-surface-stroke/20">
                      <TableHead className="text-med">Type</TableHead>
                      <TableHead className="text-med">Title</TableHead>
                      <TableHead className="text-med">Status</TableHead>
                      <TableHead className="text-med">Author</TableHead>
                      <TableHead className="text-med">Last Updated</TableHead>
                      <TableHead className="text-med">Size/URL</TableHead>
                      <TableHead className="text-med w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => (
                      <TableRow 
                        key={item.id} 
                        className={`border-surface-stroke hover:bg-surface-stroke/10 ${
                          index % 2 === 1 ? 'bg-surface-stroke/5' : ''
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(item.type)}
                            <span className="text-sm text-high capitalize">{item.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-high">{item.title}</div>
                          {item.type === 'qa' && item.question && (
                            <div className="text-xs text-med mt-1 truncate max-w-xs">
                              Q: {item.question}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <Badge 
                              variant={item.status === 'active' ? 'default' : item.status === 'processing' ? 'secondary' : 'destructive'}
                              className={
                                item.status === 'active' ? 'bg-success text-white' :
                                item.status === 'processing' ? 'bg-warning text-white' :
                                'bg-error text-white'
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-med" />
                            <span className="text-sm text-high">{item.author}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-med" />
                            <span className="text-sm text-high">{new Date(item.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.type === 'link' && item.url && (
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-med" />
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-brand-accent hover:underline truncate max-w-xs"
                              >
                                {item.url}
                              </a>
                            </div>
                          )}
                          {item.type === 'document' && item.size && (
                            <div className="flex items-center space-x-2">
                              <File className="w-4 h-4 text-med" />
                              <span className="text-sm text-high">{item.size}</span>
                            </div>
                          )}
                          {item.type === 'qa' && (
                            <div className="text-sm text-med">Q&A Pair</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="surface-01 border-surface-stroke">
                                <DropdownMenuItem className="text-high hover:bg-surface-stroke cursor-pointer">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center space-x-2">
                                        <Eye className="w-4 h-4" />
                                        <span>View</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View details</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-high hover:bg-surface-stroke cursor-pointer">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center space-x-2">
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit item</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-high hover:bg-surface-stroke cursor-pointer">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center space-x-2">
                                        <Download className="w-4 h-4" />
                                        <span>Export</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Export data</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-error hover:bg-error/10 cursor-pointer"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center space-x-2">
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Delete item</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredData.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-stroke/20 flex items-center justify-center mx-auto mb-4">
                      {activeTab === 'links' && <Link className="w-8 h-8 text-med" />}
                      {activeTab === 'documents' && <FileText className="w-8 h-8 text-med" />}
                      {activeTab === 'qa' && <MessageSquare className="w-8 h-8 text-med" />}
                    </div>
                    <h3 className="text-lg font-medium text-high mb-2">
                      No {activeTab} found
                    </h3>
                    <p className="text-med mb-4">
                      {searchQuery 
                        ? `No ${activeTab} match your search criteria.`
                        : `Start by adding your first ${activeTab.slice(0, -1)} to enhance your AI agent's knowledge.`
                      }
                    </p>
                    <Button 
                      onClick={() => setAddDialogOpen(true)}
                      className="bg-brand-accent hover:bg-brand-accent-hover text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}