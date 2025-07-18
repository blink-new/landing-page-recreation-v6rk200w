import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface PlanDetails {
  id: string
  name: string
  priceMonthly: { inr: number; usd: number }
  priceYearly: { inr: number; usd: number }
}

const planDetails: Record<string, PlanDetails> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: { inr: 6999, usd: 89 },
    priceYearly: { inr: 71399, usd: 899 }
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    priceMonthly: { inr: 19999, usd: 249 },
    priceYearly: { inr: 203999, usd: 2499 }
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { planId, isYearly } = location.state || { planId: 'starter', isYearly: false }
  
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  
  const [upiId, setUpiId] = useState('')

  const plan = planDetails[planId]
  const price = isYearly ? plan.priceYearly : plan.priceMonthly
  const gst = Math.round(price.inr * 0.18)
  const total = price.inr + gst

  useEffect(() => {
    if (!plan) {
      navigate('/pricing')
    }
  }, [plan, navigate])

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true)
      toast.success('Promo code applied! 10% discount')
    } else {
      toast.error('Invalid promo code')
    }
  }

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        toast.error('Please fill in all card details')
        return
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        toast.error('Please enter your UPI ID')
        return
      }
    }

    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
      
      // Show success for 3 seconds then redirect to home page
      setTimeout(() => {
        localStorage.removeItem('onboarding-data')
        navigate('/app/home')
      }, 3000)
    }, 2000)
  }

  const downloadInvoice = () => {
    // Create a dummy PDF download
    const element = document.createElement('a')
    element.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKE1pbyBBSSBJbnZvaWNlKQovQ3JlYXRvciAoTWlvIEFJKQovUHJvZHVjZXIgKE1pbyBBSSBQYXltZW50IFN5c3RlbSkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKMDAwMDAwMDE3OCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjI2NQolJUVPRgo='
    element.download = `mio-ai-invoice-${Date.now()}.pdf`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Invoice downloaded!')
  }

  if (!plan) return null

  if (showSuccess) {
    return (
      <div className="min-h-screen surface-00 flex items-center justify-center p-4">
        <Card className="w-full max-w-md surface-01 border-surface-stroke text-center">
          <CardContent className="pt-8 pb-6">
            <div className="space-y-6">
              {/* Success animation */}
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center animate-pulse">
                  ✓
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-headline font-bold text-high">Payment Successful!</h1>
                <p className="text-med">Welcome to Mio AI {plan.name} - Your platform is ready!</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={downloadInvoice}
                  variant="outline"
                  className="w-full border-surface-stroke text-high hover:bg-surface-stroke motion-curve"
                >
                  Download PDF Invoice
                </Button>
                
                <p className="text-sm text-low">Redirecting to your dashboard...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen surface-00 relative">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 grid-pattern" />
      </div>

      <div className="relative z-10 py-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left side - Payment form */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-headline font-bold text-high mb-2">Activate Your AI Platform</h1>
                <p className="text-med">Secure checkout powered by industry-standard encryption - Deploy intelligent agents in minutes</p>
              </div>

              <Card className="surface-01 border-surface-stroke">
                <CardHeader>
                  <CardTitle className="text-high">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid w-full grid-cols-2 surface-01">
                      <TabsTrigger value="card" className="text-high">Credit/Debit Card</TabsTrigger>
                      <TabsTrigger value="upi" className="text-high">UPI</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="card" className="space-y-4 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-med">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high placeholder:text-low"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry" className="text-med">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                            className="surface-01 border-surface-stroke text-high placeholder:text-low"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-med">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                            className="surface-01 border-surface-stroke text-high placeholder:text-low"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName" className="text-med">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                          className="surface-01 border-surface-stroke text-high placeholder:text-low"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="upi" className="space-y-4 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="upiId" className="text-med">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="surface-01 border-surface-stroke text-high placeholder:text-low"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Order summary */}
            <div className="space-y-6">
              <Card className="surface-01 border-surface-stroke">
                <CardHeader>
                  <CardTitle className="text-high">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-high">{plan.name} Plan</div>
                      <div className="text-sm text-med">
                        {isYearly ? 'Annual billing' : 'Monthly billing'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-high">₹{price.inr.toLocaleString()}</div>
                      <div className="text-sm text-med">${price.usd}</div>
                    </div>
                  </div>

                  <Separator className="bg-surface-stroke" />

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-med">Subtotal</span>
                    <span className="text-high">₹{price.inr.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-med">GST (18%)</span>
                    <span className="text-high">₹{gst.toLocaleString()}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-success">Discount (10%)</span>
                      <span className="text-success">-₹{Math.round(total * 0.1).toLocaleString()}</span>
                    </div>
                  )}

                  <Separator className="bg-surface-stroke" />

                  <div className="flex justify-between items-center font-medium">
                    <span className="text-high">Total</span>
                    <span className="text-high">
                      ₹{(promoApplied ? Math.round(total * 0.9) : total).toLocaleString()}
                    </span>
                  </div>

                  {/* Promo code */}
                  <div className="space-y-2">
                    <Label htmlFor="promo" className="text-med">Promo Code</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="promo"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                        className="surface-01 border-surface-stroke text-high placeholder:text-low"
                      />
                      <Button
                        onClick={handlePromoCode}
                        disabled={promoApplied || !promoCode}
                        variant="outline"
                        className="border-surface-stroke text-high hover:bg-surface-stroke motion-curve"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white motion-curve"
                    size="lg"
                  >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                  </Button>

                  <p className="text-xs text-low text-center">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                    Your payment is secured with 256-bit SSL encryption.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}