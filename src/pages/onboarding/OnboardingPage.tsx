import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { ArrowLeft, Sparkles, Shield, Globe, Zap } from 'lucide-react'

interface OnboardingData {
  organization: {
    name: string
    businessType: string
  }
  details: {
    vertical: string
    timezone: string
    dateTimeFormat: string
    customFormat: boolean
  }
  dataResidency: {
    region: string
  }
  domain: {
    subdomain: string
  }
}

const businessTypes = [
  'Public Company',
  'Private Company', 
  'Non-profit',
  'Government',
  'Educational',
  'Other'
]

const verticals = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Legal',
  'Marketing',
  'Consulting',
  'Media',
  'Transportation',
  'Energy',
  'Agriculture',
  'Other'
]

const regions = [
  { id: 'us-east', name: 'US East', description: 'Virginia, USA', icon: '🇺🇸' },
  { id: 'eu-central', name: 'EU Central', description: 'Frankfurt, Germany', icon: '🇪🇺' },
  { id: 'india', name: 'India', description: 'Mumbai, India', icon: '🇮🇳' },
  { id: 'apac', name: 'APAC', description: 'Singapore', icon: '🌏' }
]

const stepIcons = [
  { icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { icon: Zap, color: 'from-blue-500 to-cyan-500' },
  { icon: Shield, color: 'from-green-500 to-emerald-500' },
  { icon: Globe, color: 'from-orange-500 to-red-500' }
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { step } = useParams()
  const currentStep = parseInt(step?.replace('step-', '') || '1')
  
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('onboarding-data')
    return saved ? JSON.parse(saved) : {
      organization: { name: '', businessType: '' },
      details: { vertical: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, dateTimeFormat: 'MM/DD/YYYY HH:mm', customFormat: false },
      dataResidency: { region: '' },
      domain: { subdomain: '' }
    }
  })

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding-data', JSON.stringify(data))
  }, [data])

  const updateData = (section: keyof OnboardingData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return data.organization.name && data.organization.businessType
      case 2:
        return data.details.vertical && data.details.timezone
      case 3:
        return data.dataResidency.region
      case 4:
        return true // Domain is optional
      default:
        return false
    }
  }

  const handleNext = () => {
    if (!canContinue()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (currentStep < 4) {
      navigate(`/onboarding/step-${currentStep + 1}`)
    } else {
      // Finish onboarding - redirect to pricing
      toast.success('Setup complete! Choose your plan to continue.')
      navigate('/pricing')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/onboarding/step-${currentStep - 1}`)
    } else {
      navigate('/auth/login')
    }
  }

  const validateDomain = (domain: string) => {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/
    return domain.length >= 3 && domain.length <= 63 && regex.test(domain)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="orgName" className="text-lg font-medium text-high">
                Organization Name *
              </Label>
              <Input
                id="orgName"
                value={data.organization.name}
                onChange={(e) => updateData('organization', 'name', e.target.value)}
                placeholder="Enter your organization name"
                className="h-14 text-lg bg-surface-01/50 border-surface-stroke/50 rounded-xl focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 motion-curve"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-medium text-high">Business Type *</Label>
              <Select
                value={data.organization.businessType}
                onValueChange={(value) => updateData('organization', 'businessType', value)}
              >
                <SelectTrigger className="h-14 text-lg bg-surface-01/50 border-surface-stroke/50 rounded-xl focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 motion-curve">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent className="bg-surface-01 border-surface-stroke rounded-xl">
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-high hover:bg-surface-stroke/50 rounded-lg">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-lg font-medium text-high">Industry Vertical *</Label>
              <Select
                value={data.details.vertical}
                onValueChange={(value) => updateData('details', 'vertical', value)}
              >
                <SelectTrigger className="h-14 text-lg bg-surface-01/50 border-surface-stroke/50 rounded-xl focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 motion-curve">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent className="bg-surface-01 border-surface-stroke rounded-xl">
                  {verticals.map((vertical) => (
                    <SelectItem key={vertical} value={vertical} className="text-high hover:bg-surface-stroke/50 rounded-lg">
                      {vertical}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="timezone" className="text-lg font-medium text-high">Timezone *</Label>
              <Input
                id="timezone"
                value={data.details.timezone}
                onChange={(e) => updateData('details', 'timezone', e.target.value)}
                className="h-14 text-lg bg-surface-01/50 border-surface-stroke/50 rounded-xl"
                readOnly
              />
              <p className="text-sm text-med">Auto-detected from your location</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-surface-01/30 rounded-xl border border-surface-stroke/50">
                <div>
                  <Label className="text-lg font-medium text-high">Custom Date & Time Format</Label>
                  <p className="text-sm text-med mt-1">Enable to customize your date and time display</p>
                </div>
                <Switch
                  checked={data.details.customFormat}
                  onCheckedChange={(checked) => updateData('details', 'customFormat', checked)}
                  className="data-[state=checked]:bg-brand-accent"
                />
              </div>
              
              <Input
                value={data.details.dateTimeFormat}
                onChange={(e) => updateData('details', 'dateTimeFormat', e.target.value)}
                className="h-14 text-lg bg-surface-01/50 border-surface-stroke/50 rounded-xl"
                readOnly={!data.details.customFormat}
                placeholder="MM/DD/YYYY HH:mm"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Label className="text-lg font-medium text-high">Data Residency Region *</Label>
                <p className="text-med">Choose where your data will be stored and processed</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => updateData('dataResidency', 'region', region.id)}
                    className={`group p-6 rounded-2xl border-2 motion-curve text-left relative overflow-hidden ${
                      data.dataResidency.region === region.id
                        ? 'border-brand-accent bg-brand-accent/10 shadow-accent'
                        : 'border-surface-stroke/50 hover:border-brand-accent/50 hover:bg-surface-01/30'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{region.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-high text-lg">{region.name}</div>
                        <div className="text-med mt-1">{region.description}</div>
                      </div>
                    </div>
                    {data.dataResidency.region === region.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="domain" className="text-lg font-medium text-high">Custom Domain (Optional)</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="domain"
                  value={data.domain.subdomain}
                  onChange={(e) => updateData('domain', 'subdomain', e.target.value)}
                  placeholder="yourcompany"
                  className="h-14 text-lg bg-surface-01/50 border-surface-stroke/50 rounded-xl focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 motion-curve"
                />
                <span className="text-lg text-med font-medium">.mio.ai</span>
              </div>
              {data.domain.subdomain && !validateDomain(data.domain.subdomain) && (
                <p className="text-sm text-error">Domain must be 3-63 characters and contain only letters, numbers, and hyphens</p>
              )}
              <p className="text-sm text-med">You can skip this step and set it up later in your dashboard</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const stepTitles = [
    'Organization',
    'Details', 
    'Data Residency',
    'Domain'
  ]

  const stepDescriptions = [
    'Tell us about your organization',
    'Configure your preferences',
    'Choose your data location',
    'Set up your custom domain'
  ]

  const StepIcon = stepIcons[currentStep - 1]?.icon || Sparkles
  const iconGradient = stepIcons[currentStep - 1]?.color || 'from-purple-500 to-pink-500'

  return (
    <div className="min-h-screen surface-00 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-purple-500/5" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-brand-accent/20 to-purple-500/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Back button */}
            <Button
              onClick={handleBack}
              variant="ghost"
              className="mb-8 text-med hover:text-high hover:bg-surface-01/50 rounded-xl motion-curve"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Card className="bg-surface-01/80 backdrop-blur-xl border-surface-stroke/50 rounded-3xl shadow-2xl">
              <CardContent className="p-12">
                <div className="space-y-10">
                  {/* Header with icon */}
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <div className={`w-20 h-20 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <StepIcon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h1 className="text-4xl font-bold text-high">
                        {stepTitles[currentStep - 1]}
                      </h1>
                      <p className="text-xl text-med">
                        {stepDescriptions[currentStep - 1]}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 text-sm text-med">
                      <span>Step {currentStep} of 4</span>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-2 flex-1 rounded-full motion-curve ${
                          step <= currentStep 
                            ? 'bg-gradient-to-r from-brand-accent to-purple-500' 
                            : 'bg-surface-stroke/50'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Step content */}
                  <div className="min-h-[300px]">
                    {renderStepContent()}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between pt-8">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      disabled={currentStep === 1}
                      className="px-8 py-4 text-lg border-surface-stroke/50 text-high hover:bg-surface-stroke/50 rounded-xl motion-curve disabled:opacity-30"
                    >
                      Back
                    </Button>
                    
                    <Button
                      onClick={handleNext}
                      disabled={!canContinue()}
                      className="px-8 py-4 text-lg bg-gradient-to-r from-brand-accent to-purple-500 hover:from-brand-accent-hover hover:to-purple-400 text-white rounded-xl shadow-accent motion-curve disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentStep === 4 ? 'Complete Setup' : 'Continue'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Enhanced Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <div className="text-center space-y-8 max-w-md">
            {/* Enhanced mascot with better styling */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/30 via-purple-500/20 to-cyan-400/20 rounded-full animate-pulse-glow blur-2xl" />
              <div className="relative w-80 h-80 bg-gradient-to-br from-surface-01/80 to-surface-01/40 backdrop-blur-xl rounded-full border border-surface-stroke/30 flex items-center justify-center p-12 shadow-2xl">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-purple-600/20 rounded-full animate-neural-pulse" />
                  <img 
                    src="/mio-ai-mascot-new.png" 
                    alt="Mio AI Setup Assistant" 
                    className="relative w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-high">
                Configuring Your AI Ecosystem
              </h2>
              <p className="text-lg text-med leading-relaxed">
                We're setting up your intelligent agentic platform to seamlessly integrate with your organization's workflows and data architecture.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-surface-01/30 rounded-xl border border-surface-stroke/30 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-2">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-medium text-high">Secure</div>
                  <div className="text-xs text-med">Enterprise-grade security</div>
                </div>
                
                <div className="p-4 bg-surface-01/30 rounded-xl border border-surface-stroke/30 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-medium text-high">Fast</div>
                  <div className="text-xs text-med">Lightning-fast responses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}