import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen surface-00 text-high overflow-hidden relative">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 grid-pattern" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-headline font-bold leading-tight">
                  <span className="brand-accent">Mio AI</span>,<br />
                  <span className="text-high">Your Digital Teammate</span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-med leading-relaxed max-w-2xl">
                  High-performance, industry-ready agentic AI that works for your student engagement, enrollment processes and teams.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-4 text-lg font-medium rounded-lg motion-curve hover:scale-105 shadow-accent"
                  onClick={() => window.open('#', '_blank')}
                >
                  Book a Demo
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white px-8 py-4 text-lg font-medium rounded-lg motion-curve hover:scale-105"
                  onClick={() => navigate('/auth/login')}
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Right side - Mascot image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/mio-ai-mascot-new.png" 
                  alt="Mio AI Mascot - Advanced AI cat character in futuristic suit"
                  className="w-80 lg:w-96 xl:w-[500px] h-auto object-contain animate-float"
                />
                
                {/* Enhanced glow effect behind mascot */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/30 via-cyan-400/20 to-purple-500/20 blur-3xl rounded-full scale-75 -z-10 animate-pulse-glow" />
                
                {/* Floating particles */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-70" />
                <div className="absolute top-32 right-16 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-700 opacity-60" />
                <div className="absolute bottom-20 left-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle animated elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
      <div className="absolute top-40 right-32 w-1 h-1 bg-success rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-brand-accent/70 rounded-full animate-pulse delay-500" />
    </div>
  )
}