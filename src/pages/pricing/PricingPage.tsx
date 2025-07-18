import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, Check, X, ArrowLeft, Sparkles, Zap, Crown, Building } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  ribbon?: string
  priceMonthly: { inr: number; usd: number }
  priceYearly: { inr: number; usd: number }
  features: string[]
  popular?: boolean
  cta: string
  icon: any
  gradient: string
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    ribbon: 'No credit card',
    priceMonthly: { inr: 0, usd: 0 },
    priceYearly: { inr: 0, usd: 0 },
    features: [
      '14-day free trial',
      'Basic conversational agents',
      'Limited knowledge base (100MB)',
      'Email support',
      'Up to 100 AI interactions/month',
      'Basic workflow automation'
    ],
    cta: 'Start Free Trial',
    icon: Sparkles,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'starter',
    name: 'Starter',
    ribbon: 'Most Popular',
    priceMonthly: { inr: 6999, usd: 89 },
    priceYearly: { inr: 71399, usd: 899 },
    features: [
      'Unlimited intelligent agents',
      'Advanced knowledge base (10GB)',
      'Priority support',
      'Up to 10,000 AI interactions/month',
      'Custom integrations & APIs',
      'Advanced analytics dashboard',
      'Multi-modal AI capabilities',
      'Workflow orchestration'
    ],
    popular: true,
    cta: 'Get Started',
    icon: Zap,
    gradient: 'from-brand-accent to-purple-500'
  },
  {
    id: 'plus',
    name: 'Plus',
    priceMonthly: { inr: 19999, usd: 249 },
    priceYearly: { inr: 203999, usd: 2499 },
    features: [
      'Everything in Starter',
      'Advanced AI models (GPT-4, Claude)',
      'White-label solution',
      'Up to 50,000 AI interactions/month',
      'Full API access & webhooks',
      'Custom agentic workflows',
      'Advanced reasoning capabilities',
      'Dedicated support',
      'Enterprise integrations'
    ],
    cta: 'Upgrade to Plus',
    icon: Crown,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    ribbon: 'Talk to Sales',
    priceMonthly: { inr: 0, usd: 0 },
    priceYearly: { inr: 0, usd: 0 },
    features: [
      'Everything in Plus',
      'Unlimited AI interactions',
      'On-premise deployment',
      'Custom AI model training',
      'Advanced security & compliance',
      'SLA guarantee (99.9% uptime)',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom agentic architectures'
    ],
    cta: 'Contact Sales',
    icon: Building,
    gradient: 'from-slate-600 to-slate-800'
  }
]

const featureMatrix = [
  { feature: 'Intelligent Agents', free: '1 Basic', starter: 'Unlimited', plus: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Knowledge Base Storage', free: '100MB', starter: '10GB', plus: '100GB', enterprise: 'Unlimited' },
  { feature: 'Monthly AI Interactions', free: '100', starter: '10,000', plus: '50,000', enterprise: 'Unlimited' },
  { feature: 'Multi-modal Capabilities', free: false, starter: true, plus: true, enterprise: true },
  { feature: 'Custom Integrations', free: false, starter: true, plus: true, enterprise: true },
  { feature: 'API Access & Webhooks', free: false, starter: 'Basic', plus: 'Full', enterprise: 'Full' },
  { feature: 'Advanced AI Models', free: false, starter: false, plus: true, enterprise: true },
  { feature: 'Workflow Orchestration', free: false, starter: 'Basic', plus: 'Advanced', enterprise: 'Custom' },
  { feature: 'White-label Solution', free: false, starter: false, plus: true, enterprise: true },
  { feature: 'On-premise Deployment', free: false, starter: false, plus: false, enterprise: true },
  { feature: 'Custom AI Training', free: false, starter: false, plus: false, enterprise: true },
  { feature: 'SLA Guarantee', free: false, starter: false, plus: false, enterprise: true },
]

export default function PricingPage() {
  const navigate = useNavigate()
  const [isYearly, setIsYearly] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)

  const formatPrice = (price: { inr: number; usd: number }) => {
    if (price.inr === 0 && price.usd === 0) return 'Custom'
    return `₹${price.inr.toLocaleString()} • $${price.usd}`
  }

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      // Free trial - go directly to home page
      localStorage.removeItem('onboarding-data')
      navigate('/app/home')
    } else if (planId === 'enterprise') {
      window.open('mailto:sales@mio.ai?subject=Enterprise Plan Inquiry', '_blank')
    } else {
      // Paid plans - go to checkout first
      navigate('/checkout', { state: { planId, isYearly } })
    }
  }

  const handleBack = () => {
    navigate('/onboarding/step-4')
  }

  const getDiscountBadge = () => {
    if (!isYearly) return null
    return (
      <Badge className="bg-success/20 text-success border-success/30 rounded-full px-3 py-1">
        Save 15%
      </Badge>
    )
  }

  return (
    <div className="min-h-screen surface-00 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-purple-500/5" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Floating orbs */}
        <div className="absolute top-32 left-32 w-40 h-40 bg-gradient-to-br from-brand-accent/20 to-purple-500/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 py-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          {/* Back button */}
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-8 text-med hover:text-high hover:bg-surface-01/50 rounded-xl motion-curve"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
          </Button>

          {/* Header */}
          <div className="text-center space-y-8 mb-20">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-high leading-tight">
                Choose Your Plan
              </h1>
              <p className="text-xl text-med max-w-3xl mx-auto leading-relaxed">
                Start with a free trial, then choose the plan that scales with your business needs. 
                Unlock the full potential of AI-powered automation.
              </p>
            </div>

            {/* Enhanced billing toggle */}
            <div className="flex items-center justify-center space-x-6">
              <Label 
                htmlFor="billing-toggle" 
                className={`text-lg font-medium motion-curve cursor-pointer ${!isYearly ? 'text-high' : 'text-med'}`}
              >
                Monthly
              </Label>
              
              <div className="relative">
                <Switch
                  id="billing-toggle"
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-brand-accent data-[state=unchecked]:bg-surface-stroke scale-125"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Label 
                  htmlFor="billing-toggle" 
                  className={`text-lg font-medium motion-curve cursor-pointer ${isYearly ? 'text-high' : 'text-med'}`}
                >
                  Yearly
                </Label>
                {getDiscountBadge()}
              </div>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan) => {
              const IconComponent = plan.icon
              return (
                <Card
                  key={plan.id}
                  className={`bg-surface-01/80 backdrop-blur-xl border-surface-stroke/50 rounded-3xl relative motion-curve hover:shadow-2xl hover:shadow-brand-accent/20 hover:-translate-y-2 group ${
                    plan.popular ? 'ring-2 ring-brand-accent shadow-accent scale-105' : ''
                  }`}
                >
                  {/* Ribbon */}
                  {plan.ribbon && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge
                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                          plan.popular
                            ? 'bg-brand-accent text-white shadow-lg'
                            : plan.ribbon === 'No credit card'
                            ? 'bg-success text-white shadow-lg'
                            : 'bg-warning text-black shadow-lg'
                        }`}
                      >
                        {plan.ribbon}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center space-y-6 pt-8">
                    {/* Plan icon */}
                    <div className="flex justify-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 motion-curve`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-high">{plan.name}</h3>
                      <div className="space-y-1">
                        <div className="text-4xl font-bold text-high">
                          {formatPrice(isYearly ? plan.priceYearly : plan.priceMonthly)}
                        </div>
                        {plan.id !== 'free' && plan.id !== 'enterprise' && (
                          <div className="text-sm text-med">
                            per month{isYearly ? ', billed annually' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-8 px-8 pb-8">
                    {/* Features */}
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="w-3 h-3 text-success" />
                          </div>
                          <span className="text-med text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Add-on for Starter and Plus */}
                    {(plan.id === 'starter' || plan.id === 'plus') && (
                      <div className="pt-6 border-t border-surface-stroke/50">
                        <div className="flex items-center justify-between p-4 bg-surface-01/50 rounded-xl border border-surface-stroke/30">
                          <span className="text-sm text-med">Remove "Powered by Mio"</span>
                          <button className="text-sm text-brand-accent hover:text-brand-accent-hover motion-curve font-medium">
                            Add-on
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      onClick={() => handlePlanSelect(plan.id)}
                      className={`w-full h-14 text-lg font-medium rounded-xl motion-curve ${
                        plan.popular
                          ? 'bg-gradient-to-r from-brand-accent to-purple-500 hover:from-brand-accent-hover hover:to-purple-400 text-white shadow-accent'
                          : 'border-surface-stroke/50 text-high hover:bg-surface-stroke/50 hover:border-brand-accent/50'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Feature comparison */}
          <div className="text-center">
            <Collapsible open={showFeatures} onOpenChange={setShowFeatures}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-surface-stroke/50 text-high hover:bg-surface-stroke/50 rounded-xl px-8 py-4 text-lg"
                >
                  Compare all features
                  <ChevronDown className={`w-5 h-5 ml-3 motion-curve ${showFeatures ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-12">
                <Card className="bg-surface-01/80 backdrop-blur-xl border-surface-stroke/50 rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-surface-stroke/50 bg-surface-01/50">
                            <th className="text-left p-6 text-high font-semibold text-lg">Feature</th>
                            <th className="text-center p-6 text-high font-semibold text-lg">Free</th>
                            <th className="text-center p-6 text-high font-semibold text-lg">Starter</th>
                            <th className="text-center p-6 text-high font-semibold text-lg">Plus</th>
                            <th className="text-center p-6 text-high font-semibold text-lg">Enterprise</th>
                          </tr>
                        </thead>
                        <tbody>
                          {featureMatrix.map((row, index) => (
                            <tr
                              key={row.feature}
                              className={`${index % 2 === 0 ? 'bg-surface-stroke/10' : ''} hover:bg-surface-stroke/20 motion-curve`}
                            >
                              <td className="p-6 text-med font-medium">{row.feature}</td>
                              <td className="p-6 text-center">
                                {typeof row.free === 'boolean' ? (
                                  row.free ? (
                                    <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                                      <Check className="w-4 h-4 text-success" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 bg-error/20 rounded-full flex items-center justify-center mx-auto">
                                      <X className="w-4 h-4 text-error" />
                                    </div>
                                  )
                                ) : (
                                  <span className="text-med font-medium">{row.free}</span>
                                )}
                              </td>
                              <td className="p-6 text-center">
                                {typeof row.starter === 'boolean' ? (
                                  row.starter ? (
                                    <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                                      <Check className="w-4 h-4 text-success" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 bg-error/20 rounded-full flex items-center justify-center mx-auto">
                                      <X className="w-4 h-4 text-error" />
                                    </div>
                                  )
                                ) : (
                                  <span className="text-med font-medium">{row.starter}</span>
                                )}
                              </td>
                              <td className="p-6 text-center">
                                {typeof row.plus === 'boolean' ? (
                                  row.plus ? (
                                    <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                                      <Check className="w-4 h-4 text-success" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 bg-error/20 rounded-full flex items-center justify-center mx-auto">
                                      <X className="w-4 h-4 text-error" />
                                    </div>
                                  )
                                ) : (
                                  <span className="text-med font-medium">{row.plus}</span>
                                )}
                              </td>
                              <td className="p-6 text-center">
                                {typeof row.enterprise === 'boolean' ? (
                                  row.enterprise ? (
                                    <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                                      <Check className="w-4 h-4 text-success" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 bg-error/20 rounded-full flex items-center justify-center mx-auto">
                                      <X className="w-4 h-4 text-error" />
                                    </div>
                                  )
                                ) : (
                                  <span className="text-med font-medium">{row.enterprise}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  )
}