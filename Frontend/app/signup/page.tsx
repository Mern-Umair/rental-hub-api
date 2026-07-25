'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react'
import { useSignupMutation } from '../../redux/api/authSlidce'

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('tenant')
    const [showPassword, setShowPassword] = useState(false)
    const [signup, { isLoading }] = useSignupMutation()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await signup({ name, email, password, role }).unwrap()
            toast.success('Account created successfully!')
            router.push('/login')
        } catch (err: any) {
            toast.error(err?.data?.message || 'Signup failed!')
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
                        <CardTitle className="text-xl text-center">Create Account</CardTitle>
                        <CardDescription className="text-center">
                            Join us today and find your perfect property
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Name */}
                            <div className="space-y-1">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

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
                                        placeholder="Create a password"
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

                            {/* Role */}
                            <div className="space-y-1">
                                <Label htmlFor="role">I am a</Label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="tenant">Tenant — Looking for property</option>
                                    <option value="owner">Owner — Listing my property</option>
                                </select>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </Button>

                        </form>

                        <p className="text-center mt-4 text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600 font-medium hover:underline">
                                Sign In
                            </a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}