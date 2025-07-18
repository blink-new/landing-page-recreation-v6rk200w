import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen surface-00 flex items-center justify-center p-4 relative">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 grid-pattern" />
      </div>

      <Card className="w-full max-w-md surface-01 border-surface-stroke relative z-10">
        <CardContent className="py-16">
          <div className="text-center space-y-6">
            {/* Mascot with flashlight */}
            <div className="w-32 h-32 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto">
              <div className="w-24 h-24 bg-brand-accent/30 rounded-full flex items-center justify-center relative">
                <div className="text-4xl">🐱</div>
                <div className="absolute -bottom-2 -right-2 text-2xl">🔦</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-headline font-bold text-high">404</h1>
              <h2 className="text-xl font-headline font-bold text-high">
                Page Not Found
              </h2>
              <p className="text-med">
                Sorry, we couldn't find that page. The page you're looking for might have been moved or doesn't exist.
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/app/home')}
              className="bg-brand-accent hover:bg-brand-accent-hover text-white motion-curve"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}