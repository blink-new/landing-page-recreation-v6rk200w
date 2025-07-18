import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookOpen, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  HelpCircle,
  FileText,
  Video,
  Zap,
  Users,
  Send,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function SupportPage() {
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: ''
  })

  const supportOptions = [
    {
      title: 'Documentation',
      description: 'Comprehensive guides, API references, and tutorials',
      icon: BookOpen,
      action: () => setDocsOpen(true),
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team via email or ticket',
      icon: MessageCircle,
      action: () => setContactModalOpen(true),
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      icon: Video,
      action: () => window.open('https://youtube.com/@mioai', '_blank'),
      gradient: 'from-red-500/20 to-pink-500/20',
      iconColor: 'text-red-400'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and share knowledge',
      icon: Users,
      action: () => window.open('https://community.mio.ai', '_blank'),
      gradient: 'from-purple-500/20 to-indigo-500/20',
      iconColor: 'text-purple-400'
    }
  ]

  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of Mio AI',
      icon: Zap,
      url: '#getting-started'
    },
    {
      title: 'API Documentation',
      description: 'Complete API reference',
      icon: FileText,
      url: '#api-docs'
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and solutions',
      icon: HelpCircle,
      url: '#troubleshooting'
    },
    {
      title: 'Best Practices',
      description: 'Tips for optimal performance',
      icon: CheckCircle,
      url: '#best-practices'
    }
  ]

  const handleSubmitTicket = () => {
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.priority || !ticketForm.description) {
      toast.error('Please fill in all required fields.')
      return
    }

    // Simulate ticket submission
    setTimeout(() => {
      toast.success('Support ticket submitted successfully! We\'ll get back to you within 24 hours.')
      setContactModalOpen(false)
      setTicketForm({
        subject: '',
        category: '',
        priority: '',
        description: ''
      })
    }, 1000)
  }

  const handleEmailSupport = () => {
    const subject = encodeURIComponent('Mio AI Support Request')
    const body = encodeURIComponent('Hi Mio AI Support Team,\n\nI need help with:\n\n[Please describe your issue here]\n\nBest regards')
    window.open(`mailto:support@mio.ai?subject=${subject}&body=${body}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold text-high">
          Support Center
        </h1>
        <p className="text-med">
          Get help, access documentation, and connect with our support team.
        </p>
      </div>

      {/* Support Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportOptions.map((option) => (
          <Card 
            key={option.title}
            className="surface-01 border-surface-stroke hover:border-brand-accent/50 motion-curve cursor-pointer group"
            onClick={option.action}
          >
            <CardContent className="p-6">
              <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 motion-curve rounded-lg`} />
              <div className="relative z-10 flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-surface-stroke/20 flex items-center justify-center group-hover:scale-110 motion-curve">
                  <option.icon className={`w-6 h-6 ${option.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-headline font-bold text-high mb-2 group-hover:text-brand-accent motion-curve">
                    {option.title}
                  </h3>
                  <p className="text-med leading-relaxed">
                    {option.description}
                  </p>
                </div>
                <ExternalLink className="w-5 h-5 text-med group-hover:text-brand-accent motion-curve" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card className="surface-01 border-surface-stroke">
        <CardHeader>
          <CardTitle className="text-high">Quick Links</CardTitle>
          <p className="text-med">
            Jump to the most commonly accessed help resources.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <button
                key={link.title}
                onClick={() => setDocsOpen(true)}
                className="flex items-center space-x-3 p-4 rounded-lg border border-surface-stroke hover:border-brand-accent/50 motion-curve text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 motion-curve">
                  <link.icon className="w-5 h-5 text-brand-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-high group-hover:text-brand-accent motion-curve">
                    {link.title}
                  </h4>
                  <p className="text-sm text-med">
                    {link.description}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-med group-hover:text-brand-accent motion-curve" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="surface-01 border-surface-stroke">
        <CardHeader>
          <CardTitle className="text-high">Contact Information</CardTitle>
          <p className="text-med">
            Multiple ways to reach our support team.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-high">Email Support</h4>
                <p className="text-sm text-med mb-2">support@mio.ai</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEmailSupport}
                  className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                >
                  Send Email
                </Button>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-high">Live Chat</h4>
                <p className="text-sm text-med mb-2">Available 9 AM - 6 PM EST</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                >
                  Start Chat
                </Button>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-high">Help Center</h4>
                <p className="text-sm text-med mb-2">Self-service resources</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDocsOpen(true)}
                  className="border-purple-400/30 text-purple-400 hover:bg-purple-400/10"
                >
                  Browse Help
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Modal */}
      <Dialog open={docsOpen} onOpenChange={setDocsOpen}>
        <DialogContent className="surface-01 border-surface-stroke max-w-6xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-high flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-brand-accent" />
              <span>Documentation</span>
            </DialogTitle>
            <DialogDescription className="text-med">
              Comprehensive guides and API documentation for Mio AI.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 border border-surface-stroke rounded-lg overflow-hidden">
            <iframe
              src="https://docs.mio.ai"
              className="w-full h-full"
              title="Mio AI Documentation"
              onError={() => {
                // Fallback content if iframe fails to load
                return (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <BookOpen className="w-16 h-16 text-brand-accent mx-auto" />
                      <div>
                        <h3 className="text-lg font-medium text-high">Documentation</h3>
                        <p className="text-med">Visit our documentation site for detailed guides and API references.</p>
                        <Button 
                          className="mt-4 bg-brand-accent hover:bg-brand-accent-hover text-white"
                          onClick={() => window.open('https://docs.mio.ai', '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Documentation
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Support Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="surface-01 border-surface-stroke max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-high flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-brand-accent" />
              <span>Contact Support</span>
            </DialogTitle>
            <DialogDescription className="text-med">
              Submit a support ticket and our team will get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Email Support Option */}
            <div className="p-4 border border-surface-stroke rounded-lg bg-surface-stroke/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="font-medium text-high">Email Support</h4>
                    <p className="text-sm text-med">Send us an email directly</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={handleEmailSupport}
                  className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>

            {/* Ticket Form */}
            <div className="space-y-4">
              <h4 className="font-medium text-high">Or submit a support ticket:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-high font-medium">Category</Label>
                  <Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="surface-01 border-surface-stroke text-high">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="surface-01 border-surface-stroke">
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="account">Account Management</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-high font-medium">Priority</Label>
                  <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="surface-01 border-surface-stroke text-high">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="surface-01 border-surface-stroke">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-high font-medium">Subject</Label>
                <Input
                  id="subject"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="surface-01 border-surface-stroke text-high"
                  placeholder="Brief description of your issue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-high font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="surface-01 border-surface-stroke text-high"
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setContactModalOpen(false)}
              className="border-surface-stroke text-med hover:text-high"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitTicket}
              className="bg-brand-accent hover:bg-brand-accent-hover text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}