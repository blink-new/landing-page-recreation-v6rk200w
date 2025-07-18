import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { toast } from 'sonner'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }
    
    // Simulate sending OTP
    setShowOTPModal(true)
    setResendTimer(30)
    toast.success('Verification code sent to your email')
    
    // Start countdown
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      if (otp === '123456') {
        toast.success('Login successful!')
        navigate('/onboarding/step-1')
      } else {
        toast.error('That code didn\'t match. Try again or resend.')
        setOtp('')
      }
    }, 1000)
  }

  const handleResendOTP = () => {
    if (resendTimer > 0) return
    
    setResendTimer(30)
    toast.success('New verification code sent')
    
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleGoogleLogin = () => {
    toast.success('Google login successful!')
    navigate('/onboarding/step-1')
  }

  const handleMicrosoftLogin = () => {
    toast.success('Microsoft login successful!')
    navigate('/onboarding/step-1')
  }

  return (
    <div className="min-h-screen surface-00 flex items-center justify-center p-4 relative">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 grid-pattern" />
      </div>

      <Card className="w-full max-w-md surface-01 border-surface-stroke relative z-10">
        <CardContent className="pt-8 pb-6">
          {/* Enhanced Mascot */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/30 via-cyan-400/20 to-purple-500/30 rounded-full animate-pulse-glow" />
              <div className="relative w-full h-full bg-gradient-to-br from-brand-accent/20 to-purple-600/20 rounded-full flex items-center justify-center p-2">
                <img 
                  src="/mio-ai-mascot-new.png" 
                  alt="Mio AI - Advanced AI Assistant" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-headline font-bold text-high">Welcome to Mio AI</h1>
              <p className="text-med">Your intelligent AI agentic platform awaits</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setShowOTPModal(true)}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white motion-curve"
                size="lg"
              >
                Continue with Email
              </Button>

              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full border-surface-stroke hover:bg-surface-01 text-high motion-curve"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>

              <Button
                onClick={handleMicrosoftLogin}
                variant="outline"
                className="w-full border-surface-stroke hover:bg-surface-01 text-high motion-curve"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                  <path fill="#7fba00" d="M1 13h10v10H1z"/>
                  <path fill="#ffb900" d="M13 13h10v10H13z"/>
                </svg>
                Sign in with Microsoft
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="w-full text-center">
            <p className="text-sm text-low">
              <a href="#" className="hover:text-brand-accent motion-curve">Privacy</a>
              {' • '}
              <a href="#" className="hover:text-brand-accent motion-curve">Terms</a>
            </p>
          </div>
        </CardFooter>
      </Card>

      {/* OTP Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="surface-01 border-surface-stroke max-w-md">
          <DialogHeader>
            <DialogTitle className="text-high font-headline">Enter verification code</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-med">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="surface-01 border-surface-stroke text-high placeholder:text-low"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-med">Verification code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    onComplete={handleOTPSubmit}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="surface-01 border-surface-stroke text-high" />
                      <InputOTPSlot index={1} className="surface-01 border-surface-stroke text-high" />
                      <InputOTPSlot index={2} className="surface-01 border-surface-stroke text-high" />
                      <InputOTPSlot index={3} className="surface-01 border-surface-stroke text-high" />
                      <InputOTPSlot index={4} className="surface-01 border-surface-stroke text-high" />
                      <InputOTPSlot index={5} className="surface-01 border-surface-stroke text-high" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-low">Resend code in {resendTimer}s</p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="text-sm text-brand-accent hover:text-brand-accent-hover motion-curve"
                  >
                    Resend verification code
                  </button>
                )}
              </div>

              <Button
                onClick={handleOTPSubmit}
                disabled={otp.length !== 6 || isLoading}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white motion-curve"
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}