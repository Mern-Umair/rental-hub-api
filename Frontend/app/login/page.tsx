'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react'
import { useLoginMutation } from '../../redux/api/authSlidce'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [login, { isLoading }] = useLoginMutation()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await login({ email, password }).unwrap()
            localStorage.setItem('token', result.token)
            localStorage.setItem('user', JSON.stringify(result.user))
            toast.success('Login successful!')

            if (result.user.role === 'admin') {
                router.push('/dashboard/admin')
            } else if (result.user.role === 'owner') {
                router.push('/dashboard/owner')
            } else {
                router.push('/dashboard/tenant')
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Login failed!')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md px-4">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <div className="bg-blue-600 p-3 rounded-2xl">
                            <Building2 className="text-white w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Property Rental</h1>
                    <p className="text-gray-500 mt-1">AI Powered Platform</p>
                </div>

                <Card className="shadow-xl border-0">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Email */}
                            <div className="space-y-1">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 pr-9"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>

                        </form>

                        <p className="text-center mt-4 text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="/signup" className="text-blue-600 font-medium hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}