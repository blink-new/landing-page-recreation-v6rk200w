import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Play, 
  ChevronDown, 
  ChevronRight,
  BarChart3,
  Clock,
  Zap,
  MessageSquare,
  Code,
  Database,
  Brain,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface QueryResult {
  id: string
  query: string
  answer: string
  timestamp: string
  analysis: {
    userQuery: string
    fullPrompt: string
    modelResponse: string
    tokens: {
      input: number
      output: number
      total: number
    }
    latency: number
    confidence: number
    sources: string[]
  }
}

const mockResults: QueryResult[] = [
  {
    id: '1',
    query: 'What are your pricing plans?',
    answer: 'We offer three main pricing plans: Starter at $29/month with basic features, Professional at $79/month with advanced analytics and API access, and Enterprise at $199/month with unlimited everything and priority support.',
    timestamp: '2024-01-15T14:30:00Z',
    analysis: {
      userQuery: 'What are your pricing plans?',
      fullPrompt: 'You are Mio AI, a helpful assistant. The user is asking about pricing plans. Based on your knowledge base, provide accurate pricing information.\n\nUser query: What are your pricing plans?',
      modelResponse: 'We offer three main pricing plans: Starter at $29/month with basic features, Professional at $79/month with advanced analytics and API access, and Enterprise at $199/month with unlimited everything and priority support.',
      tokens: {
        input: 45,
        output: 38,
        total: 83
      },
      latency: 1250,
      confidence: 0.95,
      sources: ['pricing-page.pdf', 'product-documentation.md']
    }
  },
  {
    id: '2',
    query: 'How do I reset my password?',
    answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and you\'ll receive a reset link. If you don\'t see the email, check your spam folder.',
    timestamp: '2024-01-15T14:25:00Z',
    analysis: {
      userQuery: 'How do I reset my password?',
      fullPrompt: 'You are Mio AI, a helpful assistant. The user needs help with password reset. Provide clear step-by-step instructions.\n\nUser query: How do I reset my password?',
      modelResponse: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and you\'ll receive a reset link. If you don\'t see the email, check your spam folder.',
      tokens: {
        input: 42,
        output: 35,
        total: 77
      },
      latency: 980,
      confidence: 0.98,
      sources: ['user-manual.pdf', 'faq-section.md']
    }
  }
]

export default function EvaluateAgentPage() {
  const [batchQuery, setBatchQuery] = useState('')
  const [results, setResults] = useState<QueryResult[]>(mockResults)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedResult, setSelectedResult] = useState<QueryResult | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const handleRunBatch = async () => {
    if (!batchQuery.trim()) {
      toast.error('Please enter at least one query to evaluate.')
      return
    }

    const queries = batchQuery
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0)

    if (queries.length > 20) {
      toast.error('Maximum 20 queries allowed per batch.')
      return
    }

    setIsRunning(true)
    toast.success(`Running evaluation for ${queries.length} queries...`)

    // Simulate API call
    setTimeout(() => {
      const newResults = queries.map((query, index) => ({
        id: `batch-${Date.now()}-${index}`,
        query,
        answer: `This is a simulated response for: "${query}". The AI agent would provide a comprehensive answer based on the knowledge base and training data.`,
        timestamp: new Date().toISOString(),
        analysis: {
          userQuery: query,
          fullPrompt: `You are Mio AI, a helpful assistant. User query: ${query}`,
          modelResponse: `Simulated response for: ${query}`,
          tokens: {
            input: Math.floor(Math.random() * 50) + 20,
            output: Math.floor(Math.random() * 60) + 30,
            total: 0
          },
          latency: Math.floor(Math.random() * 2000) + 500,
          confidence: Math.random() * 0.3 + 0.7,
          sources: ['knowledge-base.pdf', 'documentation.md']
        }
      }))

      // Calculate total tokens
      newResults.forEach(result => {
        result.analysis.tokens.total = result.analysis.tokens.input + result.analysis.tokens.output
      })

      setResults(prev => [...newResults, ...prev])
      setIsRunning(false)
      setBatchQuery('')
      toast.success(`Evaluation completed! ${newResults.length} queries processed.`)
    }, 3000)
  }

  const handleAnalyze = (result: QueryResult) => {
    setSelectedResult(result)
    setDrawerOpen(true)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const formatLatency = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-success'
    if (confidence >= 0.7) return 'text-warning'
    return 'text-error'
  }

  const getConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100)
    if (confidence >= 0.9) return <Badge className="bg-success text-white">{percentage}%</Badge>
    if (confidence >= 0.7) return <Badge className="bg-warning text-white">{percentage}%</Badge>
    return <Badge className="bg-error text-white">{percentage}%</Badge>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold text-high">
          Evaluate Agent
        </h1>
        <p className="text-med">
          Test your AI agent with batch queries to evaluate performance, accuracy, and response quality.
        </p>
      </div>

      {/* Batch Query Input */}
      <Card className="surface-01 border-surface-stroke">
        <CardHeader>
          <CardTitle className="text-high flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-brand-accent" />
            <span>Batch Query Evaluation</span>
          </CardTitle>
          <p className="text-med">
            Enter up to 20 queries (one per line) to test your agent's responses and analyze performance metrics.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={batchQuery}
            onChange={(e) => setBatchQuery(e.target.value)}
            rows={8}
            className="surface-01 border-surface-stroke text-high font-mono text-sm"
            placeholder="What are your pricing plans?
How do I reset my password?
Can you help me with API integration?
What features are included in the Pro plan?
How do I contact support?"
            disabled={isRunning}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-med">
              {batchQuery.split('\n').filter(q => q.trim().length > 0).length} / 20 queries
            </div>
            <Button 
              onClick={handleRunBatch}
              disabled={isRunning || !batchQuery.trim()}
              className="bg-brand-accent hover:bg-brand-accent-hover text-white"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Evaluation
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card className="surface-01 border-surface-stroke">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-high flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-brand-accent" />
                <span>Evaluation Results</span>
              </CardTitle>
              <Badge variant="outline" className="border-brand-accent text-brand-accent">
                {results.length} Results
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div 
                  key={result.id}
                  className="border border-surface-stroke rounded-lg p-4 hover:border-brand-accent/50 motion-curve"
                >
                  <div className="space-y-3">
                    {/* Query */}
                    <div>
                      <h3 className="font-medium text-high mb-2 flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-brand-accent" />
                        <span>Query</span>
                      </h3>
                      <p className="text-sm text-med bg-surface-stroke/20 rounded-lg p-3 font-mono">
                        {result.query}
                      </p>
                    </div>

                    {/* Answer */}
                    <div>
                      <h3 className="font-medium text-high mb-2 flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-green-400" />
                        <span>Answer</span>
                      </h3>
                      <p className="text-sm text-high bg-surface-stroke/10 rounded-lg p-3 leading-relaxed">
                        {result.answer}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-surface-stroke">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-med">Latency</p>
                          <p className="text-sm font-medium text-high">
                            {formatLatency(result.analysis.latency)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <div>
                          <p className="text-xs text-med">Tokens</p>
                          <p className="text-sm font-medium text-high">
                            {result.analysis.tokens.total}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <div>
                          <p className="text-xs text-med">Confidence</p>
                          <div className="flex items-center space-x-1">
                            {getConfidenceBadge(result.analysis.confidence)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-xs text-med">Sources</p>
                          <p className="text-sm font-medium text-high">
                            {result.analysis.sources.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-2 border-t border-surface-stroke">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAnalyze(result)}
                        className="border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Analyze
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[600px] surface-01 border-surface-stroke">
          {selectedResult && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle className="text-high">Query Analysis</SheetTitle>
                <SheetDescription className="text-med">
                  Detailed breakdown of the AI agent's response and processing metrics.
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1">
                <div className="space-y-6">
                  {/* User Query */}
                  <Collapsible 
                    open={expandedSections.userQuery} 
                    onOpenChange={() => toggleSection('userQuery')}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-surface-stroke/20 rounded-lg hover:bg-surface-stroke/30 motion-curve">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-brand-accent" />
                        <span className="font-medium text-high">User Query</span>
                      </div>
                      {expandedSections.userQuery ? (
                        <ChevronDown className="w-4 h-4 text-med" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-med" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="p-3 bg-surface-stroke/10 rounded-lg">
                        <pre className="text-sm text-high font-mono whitespace-pre-wrap">
                          {selectedResult.analysis.userQuery}
                        </pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Full Prompt */}
                  <Collapsible 
                    open={expandedSections.fullPrompt} 
                    onOpenChange={() => toggleSection('fullPrompt')}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-surface-stroke/20 rounded-lg hover:bg-surface-stroke/30 motion-curve">
                      <div className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-blue-400" />
                        <span className="font-medium text-high">Full Prompt</span>
                      </div>
                      {expandedSections.fullPrompt ? (
                        <ChevronDown className="w-4 h-4 text-med" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-med" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="p-3 bg-surface-stroke/10 rounded-lg">
                        <pre className="text-sm text-high font-mono whitespace-pre-wrap">
                          {selectedResult.analysis.fullPrompt}
                        </pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Model Response */}
                  <Collapsible 
                    open={expandedSections.modelResponse} 
                    onOpenChange={() => toggleSection('modelResponse')}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-surface-stroke/20 rounded-lg hover:bg-surface-stroke/30 motion-curve">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-4 h-4 text-green-400" />
                        <span className="font-medium text-high">Model Response</span>
                      </div>
                      {expandedSections.modelResponse ? (
                        <ChevronDown className="w-4 h-4 text-med" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-med" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="p-3 bg-surface-stroke/10 rounded-lg">
                        <pre className="text-sm text-high font-mono whitespace-pre-wrap">
                          {selectedResult.analysis.modelResponse}
                        </pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Tokens */}
                  <Collapsible 
                    open={expandedSections.tokens} 
                    onOpenChange={() => toggleSection('tokens')}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-surface-stroke/20 rounded-lg hover:bg-surface-stroke/30 motion-curve">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium text-high">Token Usage</span>
                      </div>
                      {expandedSections.tokens ? (
                        <ChevronDown className="w-4 h-4 text-med" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-med" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="p-3 bg-surface-stroke/10 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-med">Input Tokens:</span>
                          <span className="text-sm font-medium text-high">{selectedResult.analysis.tokens.input}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-med">Output Tokens:</span>
                          <span className="text-sm font-medium text-high">{selectedResult.analysis.tokens.output}</span>
                        </div>
                        <div className="flex justify-between border-t border-surface-stroke pt-2">
                          <span className="text-sm font-medium text-high">Total Tokens:</span>
                          <span className="text-sm font-bold text-brand-accent">{selectedResult.analysis.tokens.total}</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Performance Metrics */}
                  <Collapsible 
                    open={expandedSections.performance} 
                    onOpenChange={() => toggleSection('performance')}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-surface-stroke/20 rounded-lg hover:bg-surface-stroke/30 motion-curve">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-high">Performance</span>
                      </div>
                      {expandedSections.performance ? (
                        <ChevronDown className="w-4 h-4 text-med" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-med" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="p-3 bg-surface-stroke/10 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-med">Latency:</span>
                          <span className="text-sm font-medium text-high">
                            {formatLatency(selectedResult.analysis.latency)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-med">Confidence:</span>
                          <span className={`text-sm font-medium ${getConfidenceColor(selectedResult.analysis.confidence)}`}>
                            {Math.round(selectedResult.analysis.confidence * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-med">Sources Used:</span>
                          <span className="text-sm font-medium text-high">{selectedResult.analysis.sources.length}</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}