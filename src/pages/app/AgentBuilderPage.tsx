import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  MessageSquare, 
  Phone, 
  Zap, 
  Mic,
  Settings,
  Palette,
  Upload,
  Save,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'

interface AgentCard {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  status: 'enabled' | 'disabled'
  comingSoon?: boolean
  route?: string
}

const agentCards: AgentCard[] = [
  {
    id: 'mio-sap',
    name: 'Mio SAP',
    description: 'Enterprise SAP integration with intelligent query processing and real-time data access.',
    icon: Zap,
    status: 'enabled',
    route: '/ai/agent-builder/mio-sap/personalise'
  },
  {
    id: 'mio-webchat',
    name: 'Mio Webchat',
    description: 'Web-based chat interface with advanced NLP and contextual understanding.',
    icon: MessageSquare,
    status: 'enabled',
    route: '/ai/agent-builder/mio-webchat/personalise'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'WhatsApp Business API integration for seamless customer communication.',
    icon: MessageSquare,
    status: 'disabled',
    comingSoon: true
  },
  {
    id: 'voice',
    name: 'Voice',
    description: 'Voice-enabled AI agent with speech recognition and natural language processing.',
    icon: Mic,
    status: 'disabled',
    comingSoon: true
  }
]

export default function AgentBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [agents, setAgents] = useState(agentCards)
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; agent?: AgentCard; action?: 'activate' | 'deactivate' }>({ open: false })
  const [selectedTab, setSelectedTab] = useState('configure')
  
  // Configuration state
  const [config, setConfig] = useState({
    agentName: 'Mio AI Assistant',
    description: 'A helpful AI assistant for student support and guidance.',
    embedOn: 'Web',
    verifyStudentVia: 'email',
    personaliseWith: {
      program: '',
      state: '',
      city: '',
      country: '',
      qualificationLevel: ''
    },
    responseDelay: [3],
    greetingMessage: 'Hello! How can I help you today?',
    roleDefinition: 'You are a helpful AI assistant designed to support students with their academic and administrative needs.',
    fallbackMessage: 'I apologize, but I don\'t have enough information to answer that question. Would you like me to connect you with a human agent?'
  })

  // Appearance state
  const [appearance, setAppearance] = useState({
    profilePicture: null as File | null,
    assistantTagline: 'Your AI-powered student assistant',
    sectionTitle: 'How can I help you today?',
    sectionDescription: 'Ask me anything about your studies, courses, or campus life.',
    primaryColor: '#9A66FF',
    secondaryColor: '#3DDC97',
    textColor: '#FFFFFF',
    fontStyle: 'Inter',
    fontSize: [16]
  })

  // Check if we're in personalisation mode
  const isPersonalisationMode = !!id
  const currentAgent = agents.find(agent => agent.id === id)

  const handleAgentToggle = (agent: AgentCard) => {
    if (agent.status === 'disabled' && agent.comingSoon) return
    
    const action = agent.status === 'enabled' ? 'deactivate' : 'activate'
    setConfirmDialog({ open: true, agent, action })
  }

  const confirmToggle = () => {
    if (!confirmDialog.agent) return
    
    const newStatus = confirmDialog.action === 'activate' ? 'enabled' : 'disabled'
    
    setAgents(prev => prev.map(agent => 
      agent.id === confirmDialog.agent?.id 
        ? { ...agent, status: newStatus }
        : agent
    ))
    
    toast.success(`${confirmDialog.agent.name} has been ${confirmDialog.action}d successfully.`)
    setConfirmDialog({ open: false })
  }

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAppearance(prev => ({ ...prev, profilePicture: file }))
      toast.success('Profile picture uploaded successfully!')
    }
  }

  const saveConfiguration = () => {
    toast.success('Configuration saved successfully!')
  }

  const saveAppearance = () => {
    toast.success('Appearance settings saved successfully!')
  }

  const handlePersonaliseClick = (agent: AgentCard) => {
    if (agent.route) {
      navigate(agent.route)
    }
  }

  // If in personalisation mode, show the personalisation interface
  if (isPersonalisationMode && currentAgent) {
    return (
      <div className="space-y-8">
        {/* Header with back button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/ai/agent-builder')}
            className="text-med hover:text-high"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agent Builder
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-high">
            Personalise {currentAgent.name}
          </h1>
          <p className="text-med">
            Configure your agent's behavior and appearance to match your brand and requirements.
          </p>
        </div>

        {/* Personalisation Tabs */}
        <Card className="surface-01 border-surface-stroke">
          <CardContent className="p-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="configure" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Configure</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Appearance</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="configure" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Agent Name */}
                    <div className="space-y-3">
                      <Label htmlFor="agent-name" className="text-high font-medium">Agent Name</Label>
                      <Input
                        id="agent-name"
                        value={config.agentName}
                        onChange={(e) => setConfig(prev => ({ ...prev, agentName: e.target.value }))}
                        className="surface-01 border-surface-stroke text-high"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-high font-medium">Description</Label>
                      <Textarea
                        id="description"
                        value={config.description}
                        onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="surface-01 border-surface-stroke text-high"
                      />
                    </div>

                    {/* Embed On */}
                    <div className="space-y-3">
                      <Label className="text-high font-medium">Embed On</Label>
                      <div className="p-3 bg-surface-stroke/20 rounded-lg">
                        <span className="text-med">Web</span>
                      </div>
                    </div>

                    {/* Verify Student Via */}
                    <div className="space-y-3">
                      <Label className="text-high font-medium">Verify Student Via</Label>
                      <RadioGroup 
                        value={config.verifyStudentVia} 
                        onValueChange={(value) => setConfig(prev => ({ ...prev, verifyStudentVia: value }))}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mobile" id="mobile" />
                          <Label htmlFor="mobile" className="text-med">Mobile</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email" className="text-med">Email</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Response Delay */}
                    <div className="space-y-3">
                      <Label className="text-high font-medium">
                        Response Delay: {config.responseDelay[0]}s
                      </Label>
                      <Slider
                        value={config.responseDelay}
                        onValueChange={(value) => setConfig(prev => ({ ...prev, responseDelay: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Personalise Conversation With */}
                    <div className="space-y-4">
                      <Label className="text-high font-medium">Personalise Conversation With</Label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="program" className="text-sm text-med">Program</Label>
                          <Select value={config.personaliseWith.program} onValueChange={(value) => setConfig(prev => ({ ...prev, personaliseWith: { ...prev.personaliseWith, program: value } }))}>
                            <SelectTrigger className="surface-01 border-surface-stroke text-high">
                              <SelectValue placeholder="Select program" />
                            </SelectTrigger>
                            <SelectContent className="surface-01 border-surface-stroke">
                              <SelectItem value="computer-science">Computer Science</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="arts">Arts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-sm text-med">State</Label>
                          <Select value={config.personaliseWith.state} onValueChange={(value) => setConfig(prev => ({ ...prev, personaliseWith: { ...prev.personaliseWith, state: value } }))}>
                            <SelectTrigger className="surface-01 border-surface-stroke text-high">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent className="surface-01 border-surface-stroke">
                              <SelectItem value="california">California</SelectItem>
                              <SelectItem value="new-york">New York</SelectItem>
                              <SelectItem value="texas">Texas</SelectItem>
                              <SelectItem value="florida">Florida</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm text-med">City</Label>
                          <Select value={config.personaliseWith.city} onValueChange={(value) => setConfig(prev => ({ ...prev, personaliseWith: { ...prev.personaliseWith, city: value } }))}>
                            <SelectTrigger className="surface-01 border-surface-stroke text-high">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent className="surface-01 border-surface-stroke">
                              <SelectItem value="san-francisco">San Francisco</SelectItem>
                              <SelectItem value="los-angeles">Los Angeles</SelectItem>
                              <SelectItem value="new-york-city">New York City</SelectItem>
                              <SelectItem value="chicago">Chicago</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country" className="text-sm text-med">Country</Label>
                          <Select value={config.personaliseWith.country} onValueChange={(value) => setConfig(prev => ({ ...prev, personaliseWith: { ...prev.personaliseWith, country: value } }))}>
                            <SelectTrigger className="surface-01 border-surface-stroke text-high">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="surface-01 border-surface-stroke">
                              <SelectItem value="usa">United States</SelectItem>
                              <SelectItem value="canada">Canada</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="australia">Australia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="qualification-level" className="text-sm text-med">Qualification Level</Label>
                        <Select value={config.personaliseWith.qualificationLevel} onValueChange={(value) => setConfig(prev => ({ ...prev, personaliseWith: { ...prev.personaliseWith, qualificationLevel: value } }))}>
                          <SelectTrigger className="surface-01 border-surface-stroke text-high">
                            <SelectValue placeholder="Select qualification level" />
                          </SelectTrigger>
                          <SelectContent className="surface-01 border-surface-stroke">
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="graduate">Graduate</SelectItem>
                            <SelectItem value="postgraduate">Postgraduate</SelectItem>
                            <SelectItem value="doctorate">Doctorate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Text Areas */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="greeting-message" className="text-high font-medium">Greeting Message</Label>
                        <Textarea
                          id="greeting-message"
                          value={config.greetingMessage}
                          onChange={(e) => setConfig(prev => ({ ...prev, greetingMessage: e.target.value }))}
                          rows={2}
                          className="surface-01 border-surface-stroke text-high"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role-definition" className="text-high font-medium">Role Definition</Label>
                        <Textarea
                          id="role-definition"
                          value={config.roleDefinition}
                          onChange={(e) => setConfig(prev => ({ ...prev, roleDefinition: e.target.value }))}
                          rows={3}
                          className="surface-01 border-surface-stroke text-high"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fallback-message" className="text-high font-medium">Fallback Message</Label>
                        <Textarea
                          id="fallback-message"
                          value={config.fallbackMessage}
                          onChange={(e) => setConfig(prev => ({ ...prev, fallbackMessage: e.target.value }))}
                          rows={2}
                          className="surface-01 border-surface-stroke text-high"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="space-y-3">
                      <Label className="text-high font-medium">Profile Picture</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-accent/20 to-purple-600/20 flex items-center justify-center overflow-hidden">
                          {appearance.profilePicture ? (
                            <img 
                              src={URL.createObjectURL(appearance.profilePicture)} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload className="w-6 h-6 text-brand-accent" />
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                            className="hidden"
                            id="profile-picture-upload"
                          />
                          <Label htmlFor="profile-picture-upload" className="cursor-pointer">
                            <Button variant="outline" className="border-surface-stroke text-med hover:text-high" asChild>
                              <span>Upload Picture</span>
                            </Button>
                          </Label>
                          <p className="text-xs text-med mt-1">1:1 aspect ratio recommended</p>
                        </div>
                      </div>
                    </div>

                    {/* Text Fields */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="assistant-tagline" className="text-high font-medium">Assistant Tagline</Label>
                        <Input
                          id="assistant-tagline"
                          value={appearance.assistantTagline}
                          onChange={(e) => setAppearance(prev => ({ ...prev, assistantTagline: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="section-title" className="text-high font-medium">Section Title</Label>
                        <Input
                          id="section-title"
                          value={appearance.sectionTitle}
                          onChange={(e) => setAppearance(prev => ({ ...prev, sectionTitle: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="section-description" className="text-high font-medium">Section Description</Label>
                        <Textarea
                          id="section-description"
                          value={appearance.sectionDescription}
                          onChange={(e) => setAppearance(prev => ({ ...prev, sectionDescription: e.target.value }))}
                          rows={3}
                          className="surface-01 border-surface-stroke text-high"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Color Settings */}
                    <div className="space-y-4">
                      <Label className="text-high font-medium">Colour Settings</Label>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Label className="text-sm text-med w-20">Primary</Label>
                          <input
                            type="color"
                            value={appearance.primaryColor}
                            onChange={(e) => setAppearance(prev => ({ ...prev, primaryColor: e.target.value }))}
                            className="w-12 h-12 rounded-lg border border-surface-stroke cursor-pointer"
                          />
                          <Input
                            value={appearance.primaryColor}
                            onChange={(e) => setAppearance(prev => ({ ...prev, primaryColor: e.target.value }))}
                            className="surface-01 border-surface-stroke text-high font-mono flex-1"
                          />
                        </div>

                        <div className="flex items-center space-x-3">
                          <Label className="text-sm text-med w-20">Secondary</Label>
                          <input
                            type="color"
                            value={appearance.secondaryColor}
                            onChange={(e) => setAppearance(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            className="w-12 h-12 rounded-lg border border-surface-stroke cursor-pointer"
                          />
                          <Input
                            value={appearance.secondaryColor}
                            onChange={(e) => setAppearance(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            className="surface-01 border-surface-stroke text-high font-mono flex-1"
                          />
                        </div>

                        <div className="flex items-center space-x-3">
                          <Label className="text-sm text-med w-20">Text</Label>
                          <input
                            type="color"
                            value={appearance.textColor}
                            onChange={(e) => setAppearance(prev => ({ ...prev, textColor: e.target.value }))}
                            className="w-12 h-12 rounded-lg border border-surface-stroke cursor-pointer"
                          />
                          <Input
                            value={appearance.textColor}
                            onChange={(e) => setAppearance(prev => ({ ...prev, textColor: e.target.value }))}
                            className="surface-01 border-surface-stroke text-high font-mono flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Font Settings */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-high font-medium">Font Style</Label>
                        <Select value={appearance.fontStyle} onValueChange={(value) => setAppearance(prev => ({ ...prev, fontStyle: value }))}>
                          <SelectTrigger className="surface-01 border-surface-stroke text-high">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="surface-01 border-surface-stroke">
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="DM Sans">DM Sans</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Lato">Lato</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-high font-medium">
                          Font Size: {appearance.fontSize[0]}px
                        </Label>
                        <Slider
                          value={appearance.fontSize}
                          onValueChange={(value) => setAppearance(prev => ({ ...prev, fontSize: value }))}
                          max={24}
                          min={12}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Fixed Save Button */}
            <div className="fixed bottom-6 right-6 z-50">
              <Button 
                onClick={selectedTab === 'configure' ? saveConfiguration : saveAppearance}
                className="bg-brand-accent hover:bg-brand-accent-hover text-white shadow-lg"
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default agent builder view with card deck
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold text-high">
          AI Agent Builder
        </h1>
        <p className="text-med">
          Create and manage your AI agents. Configure their behavior, appearance, and capabilities.
        </p>
      </div>

      {/* Agent Cards Grid - More compact design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <Card 
            key={agent.id}
            className={`surface-01 border-surface-stroke motion-curve hover:shadow-accent relative overflow-hidden w-[280px] h-[280px] ${
              agent.status === 'disabled' && agent.comingSoon ? 'opacity-40' : 'hover:border-brand-accent/50'
            }`}
          >
            {agent.comingSoon && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute top-3 right-3 z-10">
                      <Badge variant="outline" className="border-warning text-warning bg-warning/10">
                        Coming Soon
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-purple-500/5" />
            
            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent/20 to-purple-600/20 flex items-center justify-center">
                  <agent.icon className="w-5 h-5 text-brand-accent" />
                </div>
                <Badge 
                  variant={agent.status === 'enabled' ? 'default' : 'secondary'}
                  className={agent.status === 'enabled' ? 'bg-success text-white' : ''}
                >
                  {agent.status === 'enabled' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10 p-4 flex flex-col h-full">
              <div className="flex-1 mb-4">
                <h3 className="font-headline font-bold text-high mb-2 text-base">{agent.name}</h3>
                <p className="text-sm text-med leading-relaxed line-clamp-3">{agent.description}</p>
              </div>
              
              <div className="space-y-3 pt-3 border-t border-surface-stroke mt-auto">
                {/* Toggle Switch */}
                <div className="flex items-center justify-between min-h-[24px]">
                  <Label htmlFor={`switch-${agent.id}`} className="text-sm text-med">
                    {agent.status === 'enabled' ? 'Deactivate' : 'Activate'}
                  </Label>
                  <div className="flex-shrink-0">
                    <Switch
                      id={`switch-${agent.id}`}
                      checked={agent.status === 'enabled'}
                      onCheckedChange={() => handleAgentToggle(agent)}
                      disabled={agent.comingSoon}
                    />
                  </div>
                </div>

                {/* Personalise Button */}
                {agent.status === 'enabled' && agent.route && (
                  <Button
                    onClick={() => handlePersonaliseClick(agent)}
                    variant="outline"
                    size="sm"
                    className="w-full border-surface-stroke text-med hover:text-high hover:border-brand-accent"
                  >
                    Personalise
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ open })}>
        <DialogContent className="surface-01 border-surface-stroke">
          <DialogHeader>
            <DialogTitle className="text-high flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span>
                {confirmDialog.action === 'deactivate' ? 'Turn off this agent?' : 'Activate this agent?'}
              </span>
            </DialogTitle>
            <DialogDescription className="text-med">
              {confirmDialog.action === 'deactivate' 
                ? 'Disabling will immediately take it offline.' 
                : `Are you sure you want to activate ${confirmDialog.agent?.name}?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog({ open: false })}
              className="border-surface-stroke text-med hover:text-high"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmToggle}
              className={confirmDialog.action === 'deactivate' ? 'bg-error hover:bg-error/90 text-white' : 'bg-brand-accent hover:bg-brand-accent-hover text-white'}
            >
              {confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}