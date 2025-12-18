import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { toast } from 'react-hot-toast'
import { Chrome } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const { login, signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (isSignup) {
        await signup(email, password)
        toast.success('Account created successfully!')
        // Redirect to login page after successful signup
        setIsSignup(false)
        setEmail('')
        setPassword('')
        navigate('/login')
      } else {
        await login(email, password)
        toast.success('Logged in successfully!')
        // Redirect to dashboard after successful login
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    }
  }

  async function handleGoogleLogin() {
    try {
      await loginWithGoogle()
      toast.success('Logged in with Google!')
      // Redirect to dashboard after successful Google login
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Google authentication failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-futuristic opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,95,210,0.3),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="glass-effect border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gradient">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-foreground/70">
              {isSignup
                ? 'Create a new account to access the dashboard'
                : 'Enter your credentials to access the dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue to-blue-light hover:from-blue-light hover:to-blue border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </Button>
          </form>
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 glass-effect border-white/20 hover:bg-white/10"
              onClick={handleGoogleLogin}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary hover:underline"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

