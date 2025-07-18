import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Bell, User, Plus, Check, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
}

export default function AppHomePage() {
  const [userName] = useState('Alex') // In real app, get from auth
  const [showTour, setShowTour] = useState(true)
  const [tourStep, setTourStep] = useState(0)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'create-agent',
      title: 'Create first Agent',
      description: 'Set up your first AI agent to handle customer inquiries',
      completed: false
    },
    {
      id: 'connect-kb',
      title: 'Connect Knowledge Base',
      description: 'Upload documents and data for your agent to reference',
      completed: false
    },
    {
      id: 'test-chat',
      title: 'Test Chat',
      description: 'Try out your agent with sample conversations',
      completed: false
    },
    {
      id: 'publish-share',
      title: 'Publish & Share',
      description: 'Make your agent live and share it with your team',
      completed: false
    }
  ])

  const completedCount = checklist.filter(item => item.completed).length
  const progressPercentage = (completedCount / checklist.length) * 100

  const tourSteps = useMemo(() => [
    {
      target: '[data-tour="agent-builder"]',
      title: 'Agent Builder',
      content: 'Create and customize your AI agents here. Start with templates or build from scratch.'
    },
    {
      target: '[data-tour="knowledge-base"]',
      title: 'Knowledge Base',
      content: 'Upload documents, FAQs, and data sources for your agents to reference.'
    },
    {
      target: '[data-tour="workflows"]',
      title: 'Workflows',
      content: 'Set up automated processes and integrations with your existing tools.'
    },
    {
      target: '[data-tour="settings"]',
      title: 'Settings',
      content: 'Configure your workspace, team permissions, and billing settings.'
    }
  ], [])

  const handleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
    
    if (!checklist.find(item => item.id === id)?.completed) {
      toast.success('Great job! Keep going to complete your setup.')
    }
  }

  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1)
    } else {
      setShowTour(false)
      toast.success("You're all set! Start building amazing AI agents.")
    }
  }

  const skipTour = () => {
    setShowTour(false)
  }

  useEffect(() => {
    // Auto-launch tour after component mounts
    if (showTour) {
      const timer = setTimeout(() => {
        // In a real app, this would highlight the actual elements
        console.log('Tour step:', tourSteps[tourStep])
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [tourStep, showTour, tourSteps])

  return (
    <div className="min-h-screen surface-00">
      {/* Header */}
      <header className="border-b border-surface-stroke surface-01">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-brand-accent to-purple-600 p-0.5">
                  <img 
                    src="/mio-ai-mascot-new.png" 
                    alt="Mio AI" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h1 className="text-xl font-headline font-bold text-high">Mio AI</h1>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <button 
                  data-tour="agent-builder"
                  className="text-med hover:text-high motion-curve px-3 py-2 rounded-lg hover:bg-surface-stroke"
                >
                  Agent Builder
                </button>
                <button 
                  data-tour="knowledge-base"
                  className="text-med hover:text-high motion-curve px-3 py-2 rounded-lg hover:bg-surface-stroke"
                >
                  Knowledge Base
                </button>
                <button 
                  data-tour="workflows"
                  className="text-med hover:text-high motion-curve px-3 py-2 rounded-lg hover:bg-surface-stroke"
                >
                  Workflows
                </button>
                <button 
                  data-tour="settings"
                  className="text-med hover:text-high motion-curve px-3 py-2 rounded-lg hover:bg-surface-stroke"
                >
                  Settings
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-med hover:text-high">
                <Bell className="w-5 h-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-med hover:text-high">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="surface-01 border-surface-stroke">
                  <DropdownMenuItem className="text-high hover:bg-surface-stroke">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="text-high hover:bg-surface-stroke">Billing</DropdownMenuItem>
                  <DropdownMenuItem className="text-high hover:bg-surface-stroke">Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Welcome section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold text-high">
              Welcome back, {userName}!
            </h1>
            <p className="text-med">
              Let's get your AI agents up and running. Complete the steps below to get started.
            </p>
          </div>

          {/* Quick-start checklist */}
          <Card className="surface-01 border-surface-stroke">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-high">Quick-Start Checklist</CardTitle>
                <Badge variant="outline" className="border-brand-accent text-brand-accent">
                  {completedCount}/{checklist.length} completed
                </Badge>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklist.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border motion-curve cursor-pointer ${
                      item.completed
                        ? 'border-success/30 bg-success/5'
                        : 'border-surface-stroke hover:border-brand-accent/50'
                    }`}
                    onClick={() => handleChecklistItem(item.id)}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center motion-curve ${
                      item.completed
                        ? 'border-success bg-success text-white'
                        : 'border-surface-stroke'
                    }`}>
                      {item.completed && <Check className="w-4 h-4" />}
                      {!item.completed && <span className="text-xs text-med">{index + 1}</span>}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-medium ${item.completed ? 'text-success' : 'text-high'}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-med">{item.description}</p>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-med" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Agent Creation Hub */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Agent Creation Card */}
            <Card className="surface-01 border-surface-stroke relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-purple-500/5" />
              <CardContent className="py-12 relative z-10">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 via-cyan-400/10 to-purple-500/20 rounded-full animate-pulse-glow" />
                    <div className="relative w-full h-full bg-gradient-to-br from-brand-accent/30 to-purple-600/30 rounded-full flex items-center justify-center p-4">
                      <img 
                        src="/mio-ai-mascot-new.png" 
                        alt="Mio AI Agent" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-2xl font-headline font-bold text-high">
                      Deploy Your First AI Agent
                    </h2>
                    <p className="text-med max-w-md mx-auto leading-relaxed">
                      Create intelligent agents that understand context, learn from interactions, 
                      and seamlessly integrate with your existing workflows.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="bg-brand-accent hover:bg-brand-accent-hover text-white motion-curve shadow-accent">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Agent
                    </Button>
                    <Button variant="outline" className="border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10 motion-curve">
                      Browse Templates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Capabilities Showcase */}
            <Card className="surface-01 border-surface-stroke">
              <CardContent className="py-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-headline font-bold text-high">AI Capabilities</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">🧠</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-high">Natural Language Processing</h4>
                        <p className="text-sm text-med">Advanced understanding of context and intent</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-sm">⚡</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-high">Real-time Learning</h4>
                        <p className="text-sm text-med">Continuously improves from interactions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm">🔗</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-high">Multi-Modal Integration</h4>
                        <p className="text-sm text-med">Text, voice, and visual processing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Product tour overlay */}
      {showTour && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="surface-01 border-surface-stroke max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-high">{tourSteps[tourStep].title}</CardTitle>
                <Badge variant="outline" className="border-brand-accent text-brand-accent">
                  {tourStep + 1}/{tourSteps.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-med">{tourSteps[tourStep].content}</p>
              
              <div className="flex justify-between">
                <Button
                  onClick={skipTour}
                  variant="outline"
                  className="border-surface-stroke text-med hover:bg-surface-stroke motion-curve"
                >
                  Skip Tour
                </Button>
                
                <Button
                  onClick={nextTourStep}
                  className="bg-brand-accent hover:bg-brand-accent-hover text-white motion-curve"
                >
                  {tourStep === tourSteps.length - 1 ? "You're all set!" : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}